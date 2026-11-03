import { G120_MANUAL_URL, manualPageLabel } from './g120ListManual'
import type { ManufacturerFaultCode } from './vfdFaultCodes'

/** Reaction, acknowledgement and page of the fault in the Siemens List Manual, so the technician can look it up. */
export function ManualMeta({ manual }: { manual: NonNullable<ManufacturerFaultCode['manual']> }) {
  return (
    <dl className="manual-meta">
      <div>
        <dt>Reaksiyon</dt>
        <dd>{manual.reaction}</dd>
      </div>
      <div>
        <dt>Onaylama</dt>
        <dd>{manual.acknowledge}</dd>
      </div>
      <div className="manual-meta-wide">
        <dt>Mesaj sınıfı</dt>
        <dd>{manual.messageClass}</dd>
      </div>
      <div className="manual-meta-wide">
        <dt>Kaynak</dt>
        <dd>
          <a href={G120_MANUAL_URL} target="_blank" rel="noopener noreferrer">
            Siemens G120 CU240B-2/CU240E-2 List Manual 09/2020
          </a>
          , {manualPageLabel(manual)}
        </dd>
      </div>
    </dl>
  )
}
