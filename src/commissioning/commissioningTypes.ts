export type ControlUnit = '' | 'CU240B-2' | 'CU240E-2'
export type MotorConnection = '' | 'Yıldız (Y)' | 'Üçgen (Δ)' | 'Etikette Y/Δ birlikte verilmiş' | 'Emin değilim'
export type DualVoltageConnection = 'Delta' | 'Star' | 'Unknown'
export type LoadType = '' | 'Konveyör / sabit tork' | 'Pompa / fan' | 'Ağır kalkış' | 'Sık ileri-geri çalışma' | 'Hızlı hızlanma-yavaşlama' | 'Genel makine' | 'Emin değilim'
export type ControlMethod = '' | 'Terminal + analog 0–10 V' | 'Terminal + analog 4–20 mA' | 'Sabit hızlar' | 'PROFINET / PLC' | 'PROFIBUS / PLC' | 'BOP-2 üzerinden test' | 'Emin değilim'
export type SafetyAnswer = '' | 'Evet' | 'Hayır' | 'Emin değilim'

export interface CommissioningProfile {
  drive: {
    manufacturer: 'Siemens'
    driveFamily: 'SINAMICS G120'
    controlUnit: ControlUnit
    mainsVoltage?: number
    motorStandard: 'IEC'
    motorType: 'Asenkron motor'
  }
  motor: {
    ratedPowerKw?: number
    ratedVoltageV?: number
    ratedCurrentA?: number
    ratedFrequencyHz?: number
    ratedSpeedRpm?: number
    powerFactor?: number
    connection: MotorConnection
    lowVoltageV?: number
    highVoltageV?: number
    lowVoltageCurrentA?: number
    highVoltageCurrentA?: number
    lowVoltageConnection: DualVoltageConnection
    highVoltageConnection: DualVoltageConnection
  }
  application: {
    loadType: LoadType
    controlMethod: ControlMethod
  }
  motion: {
    minimumSpeedRpm?: number
    maximumSpeedRpm?: number
    accelerationTimeSec?: number
    decelerationTimeSec?: number
  }
  identification: {
    loadCanBeDisconnected: SafetyAnswer
    rotationIsSafe: SafetyAnswer
  }
}

export const emptyCommissioningProfile: CommissioningProfile = {
  drive: {
    manufacturer: 'Siemens',
    driveFamily: 'SINAMICS G120',
    controlUnit: '',
    motorStandard: 'IEC',
    motorType: 'Asenkron motor',
  },
  motor: { connection: '', lowVoltageConnection: 'Unknown', highVoltageConnection: 'Unknown' },
  application: { loadType: '', controlMethod: '' },
  motion: {},
  identification: { loadCanBeDisconnected: '', rotationIsSafe: '' },
}
