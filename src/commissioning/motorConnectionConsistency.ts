import type { CommissioningProfile, DualVoltageConnection, MotorConnection } from './commissioningTypes'

export type ConnectionConsistencyStatus = 'consistent' | 'warning' | 'insufficient-data'
export type ExpectedMotorConnection = 'Delta' | 'Star'

export interface MotorConnectionConsistency {
  status: ConnectionConsistencyStatus
  expectedConnection?: ExpectedMotorConnection
  matchedNameplateVoltage?: number
  matchedNameplateCurrent?: number
  observations: string[]
  warnings: string[]
}

const voltageTolerance = 0.05

const isCloseVoltage = (measured: number, nameplate: number) => Math.abs(measured - nameplate) / nameplate <= voltageTolerance

const displayConnection = (connection: ExpectedMotorConnection) => connection === 'Delta' ? 'Δ' : 'Y'
const selectedConnection = (connection: MotorConnection): ExpectedMotorConnection | undefined => connection === 'Üçgen (Δ)' ? 'Delta' : connection === 'Yıldız (Y)' ? 'Star' : undefined

const isDualVoltageComplete = (profile: CommissioningProfile) => {
  const { lowVoltageV, highVoltageV, lowVoltageConnection, highVoltageConnection } = profile.motor
  return lowVoltageV !== undefined && highVoltageV !== undefined && lowVoltageV > 0 && highVoltageV > 0 && lowVoltageConnection !== 'Unknown' && highVoltageConnection !== 'Unknown'
}

const connectionForVoltage = (connection: DualVoltageConnection): ExpectedMotorConnection | undefined => connection === 'Delta' || connection === 'Star' ? connection : undefined

export function evaluateMotorConnectionConsistency(profile: CommissioningProfile): MotorConnectionConsistency {
  const { mainsVoltage } = profile.drive
  const { lowVoltageV, highVoltageV, lowVoltageCurrentA, highVoltageCurrentA, ratedCurrentA } = profile.motor

  if (!isDualVoltageComplete(profile)) {
    return {
      status: 'insufficient-data',
      observations: ['Tek gerilim bilgisiyle motor terminal bağlantısı güvenilir şekilde belirlenemez. Motor etiketi ve terminal kutusu bağlantısını doğrulayın.'],
      warnings: [],
    }
  }

  if (mainsVoltage === undefined || mainsVoltage <= 0) {
    return {
      status: 'insufficient-data',
      observations: ['Şebeke/sürücü gerilimi girilmediği için çift gerilim etiketiyle bağlantı beklentisi belirlenemedi.'],
      warnings: [],
    }
  }

  const matchesLow = isCloseVoltage(mainsVoltage, lowVoltageV!)
  const matchesHigh = isCloseVoltage(mainsVoltage, highVoltageV!)
  if (!matchesLow && !matchesHigh) {
    return {
      status: 'insufficient-data',
      observations: [`Şebeke/sürücü gerilimi: ${mainsVoltage} V`],
      warnings: ['Şebeke/sürücü gerilimi motor etiketindeki gerilim değerleriyle açık şekilde eşleşmiyor.'],
    }
  }

  const useLowVoltage = matchesLow
  const expectedConnection = connectionForVoltage(useLowVoltage ? profile.motor.lowVoltageConnection : profile.motor.highVoltageConnection)
  const matchedNameplateVoltage = useLowVoltage ? lowVoltageV : highVoltageV
  const matchedNameplateCurrent = useLowVoltage ? lowVoltageCurrentA : highVoltageCurrentA
  if (!expectedConnection) {
    return { status: 'insufficient-data', observations: [], warnings: ['Etiket bağlantı düzeni belirlenmediği için beklenen bağlantı çıkarılamadı.'] }
  }

  const observations = [
    `Şebeke/sürücü gerilimi: ${mainsVoltage} V`,
    `Etiket: ${lowVoltageV}/${highVoltageV} V ${displayConnection(profile.motor.lowVoltageConnection as ExpectedMotorConnection)}/${displayConnection(profile.motor.highVoltageConnection as ExpectedMotorConnection)}`,
    `Beklenen bağlantı: ${displayConnection(expectedConnection)}`,
    ...(matchedNameplateCurrent === undefined ? [] : [`İlgili etiket akımı: ${matchedNameplateCurrent} A`]),
  ]
  const warnings: string[] = []
  const selected = selectedConnection(profile.motor.connection)
  if (selected && selected !== expectedConnection) {
    warnings.push(`Bağlantı seçimi motor etiketiyle uyumsuz görünüyor. ${lowVoltageV}/${highVoltageV} V ${displayConnection(profile.motor.lowVoltageConnection as ExpectedMotorConnection)}/${displayConnection(profile.motor.highVoltageConnection as ExpectedMotorConnection)} etiketli bu motor için ${mainsVoltage} V normal çalışma koşulunda ${displayConnection(expectedConnection)} bağlantısı beklenir.`)
  }
  if (matchedNameplateCurrent !== undefined && ratedCurrentA !== undefined && Math.abs(ratedCurrentA - matchedNameplateCurrent) / matchedNameplateCurrent > 0.1) {
    warnings.push('Girilen nominal akım, seçilen gerilim/bağlantı için etiket akımıyla uyuşmuyor.')
  }

  return { status: warnings.length > 0 ? 'warning' : 'consistent', expectedConnection, matchedNameplateVoltage, matchedNameplateCurrent, observations, warnings }
}
