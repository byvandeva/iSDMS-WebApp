import React from 'react';
import { Eye } from 'lucide-react';

export default function RetentionTable({ data, onRowClick }) {
  if (data.length === 0) {
    return (
      <div className="drh-table-empty">
        Tidak ada data retensi yang sesuai dengan filter yang dipilih.
      </div>
    );
  }

  return (
    <div className="drh-table-wrapper">
      <table className="drh-table">
        <thead>
          <tr>
            <th className="drh-th">Pelanggan</th>
            <th className="drh-th">No. SPK</th>
            <th className="drh-th">Kendaraan</th>
            <th className="drh-th">Odometer</th>
            <th className="drh-th">Kategori KM</th>
            <th className="drh-th">Status Kontak</th>
            <th className="drh-th">Keterangan</th>
            <th className="drh-th drh-th--action">Detail</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <RetentionRow
              key={item.retentionNo}
              item={item}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RetentionRow({ item, onRowClick }) {
  const isConnected = item.isConfirmed === '1';

  return (
    <tr className="drh-tr">
      <td className="drh-td">
        <div className="drh-td-primary">{item.customerName}</div>
        <div className="drh-td-secondary">{item.customerCode} · {item.phoneNo}</div>
      </td>
      <td className="drh-td">
        <div className="drh-td-primary">{item.jobOrderNo}</div>
        <div className="drh-td-secondary">{item.jobOrderDate}</div>
      </td>
      <td className="drh-td">
        <div className="drh-td-primary">{item.policeRegNo}</div>
        <div className="drh-td-secondary">{item.basicModel} ({item.transmissionType})</div>
      </td>
      <td className="drh-td">
        <div className="drh-td-primary">{item.odometer.toLocaleString('id-ID')} km</div>
        <div className="drh-td-secondary">{item.jobType}</div>
      </td>
      <td className="drh-td">
        <span className={`drh-badge ${item.categoryKM.includes('Unit') ? 'drh-badge--unit' : 'drh-badge--service'}`}>
          {item.categoryKM}
        </span>
      </td>
      <td className="drh-td">
        <span className={`drh-badge ${isConnected ? 'drh-badge--connected' : 'drh-badge--not-connected'}`}>
          {isConnected ? 'Terhubung' : 'Tidak Terhubung'}
        </span>
      </td>
      <td className="drh-td">
        <div className="drh-td-primary">{item.cannotCallCode}</div>
        <div className="drh-td-secondary">{item.reason || '-'}</div>
      </td>
      <td className="drh-td drh-td--center drh-td--action">
        <button
          type="button"
          className="drh-detail-btn"
          onClick={() => onRowClick(item)}
          title="Lihat Detail"
        >
          <Eye size={15} />
        </button>
      </td>
    </tr>
  );
}
