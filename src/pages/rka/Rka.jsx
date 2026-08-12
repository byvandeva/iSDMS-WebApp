import React, { useState, useEffect, useMemo } from 'react';
import { Save, Edit3, X, RefreshCw, CheckCircle } from 'lucide-react';
import { theme } from '../../configs/themeConfig';
import PageHeader from '../../navigation/PageHeader';
import { getRkaPerformance, upsertRkaTarget } from './api';
import { calculateAchievementRatio } from './types';

const DEALER_OPTIONS = [
  { code: 'SDMS-6006401', name: '6006401 - Suzuki Sunter Jaya' },
  { code: 'SDMS-6006402', name: '6006402 - Suzuki BSD Serpong' },
  { code: 'SDMS-6006403', name: '6006403 - Suzuki Pulogadung' },
  { code: 'SDMS-6006404', name: '6006404 - Suzuki Depok Margonda' }
];

const YEAR_OPTIONS = [2025, 2026, 2027];

const SUB_TABS = [
  {
    id: 'bookingSro',
    label: 'Rasio Booking SRO vs RKA',
    targetKey: 'bookingSroTarget',
    actualKey: 'bookingSroActual',
    ratioKey: 'bookingSroRatio',
    desc: 'Pemantauan pencapaian booking SRO dibanding target RKA per bulan'
  },
  {
    id: 'unitIntake',
    label: 'Rasio Unit Intake vs RKA',
    targetKey: 'unitIntakeTarget',
    actualKey: 'unitIntakeActual',
    ratioKey: 'unitIntakeRatio',
    desc: 'Pemantauan unit masuk bengkel dibanding target RKA per bulan'
  },
  {
    id: 'bookingShowUp',
    label: 'Rasio Booking Show-Up vs RKA',
    targetKey: 'bookingShowUpTarget',
    actualKey: 'bookingShowUpActual',
    ratioKey: 'bookingShowUpRatio',
    desc: 'Pemantauan kedatangan booking dibanding target RKA per bulan'
  }
];

export default function RkaPage() {
  const [selectedDealer, setSelectedDealer] = useState('SDMS-6006401');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [activeSubTab, setActiveSubTab] = useState('bookingSro');
  const [performanceData, setPerformanceData] = useState([]);
  const [editableTargets, setEditableTargets] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const loadPerformanceData = async () => {
    setIsLoading(true);
    const data = await getRkaPerformance(selectedDealer, selectedYear);
    setPerformanceData(data);

    const initialTargets = {};
    data.forEach(item => {
      initialTargets[item.month] = {
        bookingSroTarget: item.bookingSroTarget,
        unitIntakeTarget: item.unitIntakeTarget,
        bookingShowUpTarget: item.bookingShowUpTarget
      };
    });
    setEditableTargets(initialTargets);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPerformanceData();
  }, [selectedDealer, selectedYear]);

  const currentSubTabConfig = useMemo(() => {
    return SUB_TABS.find(t => t.id === activeSubTab) || SUB_TABS[0];
  }, [activeSubTab]);

  const handleTargetInputChange = (month, field, value) => {
    const numericValue = Math.max(0, parseInt(value, 10) || 0);
    setEditableTargets(prev => ({
      ...prev,
      [month]: {
        ...prev[month],
        [field]: numericValue
      }
    }));
  };

  const handleSaveTargets = async () => {
    setIsLoading(true);
    const payloadTargets = Object.keys(editableTargets).map(monthStr => {
      const monthNumber = Number(monthStr);
      return {
        month: monthNumber,
        bookingSroTarget: editableTargets[monthNumber].bookingSroTarget,
        unitIntakeTarget: editableTargets[monthNumber].unitIntakeTarget,
        bookingShowUpTarget: editableTargets[monthNumber].bookingShowUpTarget
      };
    });

    const payload = {
      dealerCode: selectedDealer,
      year: selectedYear,
      targets: payloadTargets
    };

    await upsertRkaTarget(payload);

    const updatedData = performanceData.map(item => {
      const updatedTarget = editableTargets[item.month] || {};
      const bookingSroTarget = updatedTarget.bookingSroTarget ?? item.bookingSroTarget;
      const unitIntakeTarget = updatedTarget.unitIntakeTarget ?? item.unitIntakeTarget;
      const bookingShowUpTarget = updatedTarget.bookingShowUpTarget ?? item.bookingShowUpTarget;

      return {
        ...item,
        bookingSroTarget,
        bookingSroRatio: calculateAchievementRatio(item.bookingSroActual, bookingSroTarget),
        unitIntakeTarget,
        unitIntakeRatio: calculateAchievementRatio(item.unitIntakeActual, unitIntakeTarget),
        bookingShowUpTarget,
        bookingShowUpRatio: calculateAchievementRatio(item.bookingShowUpActual, bookingShowUpTarget)
      };
    });

    setPerformanceData(updatedData);
    setIsEditMode(false);
    setIsLoading(false);
    setStatusMessage('Target RKA berhasil diperbarui');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCancelEdit = () => {
    const resetTargets = {};
    performanceData.forEach(item => {
      resetTargets[item.month] = {
        bookingSroTarget: item.bookingSroTarget,
        unitIntakeTarget: item.unitIntakeTarget,
        bookingShowUpTarget: item.bookingShowUpTarget
      };
    });
    setEditableTargets(resetTargets);
    setIsEditMode(false);
  };

  const tabMetrics = useMemo(() => {
    if (performanceData.length === 0) {
      return { averageRatio: 0, totalActual: 0, totalTarget: 0 };
    }

    let totalRatioSum = 0;
    let totalActualSum = 0;
    let totalTargetSum = 0;

    performanceData.forEach(item => {
      const currentTargetObj = editableTargets[item.month] || item;
      const targetVal = currentTargetObj[currentSubTabConfig.targetKey] || 0;
      const actualVal = item[currentSubTabConfig.actualKey] || 0;
      const ratioVal = isEditMode
        ? calculateAchievementRatio(actualVal, targetVal)
        : item[currentSubTabConfig.ratioKey];

      totalRatioSum += ratioVal;
      totalActualSum += actualVal;
      totalTargetSum += targetVal;
    });

    const count = performanceData.length;
    return {
      averageRatio: Math.round(totalRatioSum / count),
      totalActual: totalActualSum,
      totalTarget: totalTargetSum
    };
  }, [performanceData, editableTargets, currentSubTabConfig, isEditMode]);

  return (
    <div style={{ padding: 0, backgroundColor: 'transparent' }}>
      <PageHeader
        title="Monitoring RKA Unit Dealer (CCM)"
        action={
          isEditMode ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                disabled={isLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <X size={15} />
                <span>Batal</span>
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveTargets}
                disabled={isLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: theme.color.primary }}
              >
                <Save size={15} />
                <span>Simpan Target RKA</span>
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditMode(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: theme.color.primary }}
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </button>
          )
        }
      />

      {statusMessage && (
        <div style={{
          backgroundColor: theme.color.surfaceAlt,
          border: `1px solid ${theme.color.border}`,
          color: theme.color.textPrimary,
          padding: '0.75rem 1rem',
          borderRadius: theme.radius.sm,
          marginBottom: '1rem',
          fontWeight: 600,
          fontSize: theme.font.sizeSm,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={16} color={theme.color.primary} />
          <span>{statusMessage}</span>
        </div>
      )}

      <div style={{
        backgroundColor: theme.color.surface,
        borderRadius: theme.radius.md,
        padding: '1rem 1.25rem',
        border: `1px solid ${theme.color.border}`,
        marginBottom: '1.25rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: theme.font.sizeXs, fontWeight: 700, color: theme.color.textMuted }}>PILIH DEALER</label>
            <select
              value={selectedDealer}
              onChange={(e) => setSelectedDealer(e.target.value)}
              disabled={isEditMode}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: theme.radius.sm,
                border: `1px solid ${theme.color.border}`,
                backgroundColor: theme.color.surface,
                color: theme.color.textPrimary,
                fontWeight: 600,
                fontSize: theme.font.sizeSm
              }}
            >
              {DEALER_OPTIONS.map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: theme.font.sizeXs, fontWeight: 700, color: theme.color.textMuted }}>TAHUN</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              disabled={isEditMode}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: theme.radius.sm,
                border: `1px solid ${theme.color.border}`,
                backgroundColor: theme.color.surface,
                color: theme.color.textPrimary,
                fontWeight: 600,
                fontSize: theme.font.sizeSm
              }}
            >
              {YEAR_OPTIONS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={loadPerformanceData}
          disabled={isLoading || isEditMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.75rem',
            borderRadius: theme.radius.sm,
            border: `1px solid ${theme.color.border}`,
            backgroundColor: theme.color.surfaceAlt,
            color: theme.color.textSecondary,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: theme.font.sizeSm,
            marginLeft: 'auto'
          }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: `2px solid ${theme.color.borderLight}`,
        marginBottom: '1.25rem'
      }}>
        {SUB_TABS.map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '0.7rem 1.25rem',
                border: 'none',
                borderBottom: isActive ? `3px solid ${theme.color.primary}` : '3px solid transparent',
                backgroundColor: isActive ? theme.color.surface : 'transparent',
                color: isActive ? theme.color.primary : theme.color.textMuted,
                fontWeight: isActive ? 800 : 600,
                fontSize: theme.font.sizeSm,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                marginBottom: '-2px',
                borderRadius: `${theme.radius.sm} ${theme.radius.sm} 0 0`
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{
          backgroundColor: theme.color.surface,
          borderRadius: theme.radius.md,
          padding: '1.15rem',
          border: `1px solid ${theme.color.border}`,
          boxShadow: theme.shadow.card
        }}>
          <div style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
            Rerata Pencapaian Tahunan
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.color.textPrimary, marginTop: '0.5rem' }}>
            {tabMetrics.averageRatio}%
          </div>
        </div>

        <div style={{
          backgroundColor: theme.color.surface,
          borderRadius: theme.radius.md,
          padding: '1.15rem',
          border: `1px solid ${theme.color.border}`,
          boxShadow: theme.shadow.card
        }}>
          <div style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
            Total Actual Tahunan
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.color.textPrimary, marginTop: '0.5rem' }}>
            {tabMetrics.totalActual} <span style={{ fontSize: '0.85rem', color: theme.color.textMuted, fontWeight: 600 }}>Unit</span>
          </div>
        </div>

        <div style={{
          backgroundColor: theme.color.surface,
          borderRadius: theme.radius.md,
          padding: '1.15rem',
          border: `1px solid ${theme.color.border}`,
          boxShadow: theme.shadow.card
        }}>
          <div style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
            Total Target RKA Tahunan
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.color.textPrimary, marginTop: '0.5rem' }}>
            {tabMetrics.totalTarget} <span style={{ fontSize: '0.85rem', color: theme.color.textMuted, fontWeight: 600 }}>Unit</span>
          </div>
        </div>
      </div>

      <div className="table-responsive-container" style={{
        backgroundColor: theme.color.surface,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadow.card
      }}>
        <table className="enterprise-table" style={{ border: 'none', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>No</th>
              <th style={{ width: '180px' }}>Bulan</th>
              <th style={{ textAlign: 'right', width: '200px' }}>Target RKA</th>
              <th style={{ textAlign: 'right', width: '200px' }}>Actual</th>
              <th style={{ textAlign: 'center', width: '200px' }}>Pencapaian (%)</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((row, idx) => {
              const currentTargetObj = editableTargets[row.month] || row;
              const currentTargetVal = currentTargetObj[currentSubTabConfig.targetKey];
              const currentActualVal = row[currentSubTabConfig.actualKey];
              const currentRatioVal = isEditMode
                ? calculateAchievementRatio(currentActualVal, currentTargetVal)
                : row[currentSubTabConfig.ratioKey];

              return (
                <tr key={row.month}>
                  <td style={{ textAlign: 'center', color: theme.color.textMuted }}>{idx + 1}</td>
                  <td style={{ fontWeight: 700, color: theme.color.textPrimary }}>{row.monthName}</td>
                  <td style={{ textAlign: 'right' }}>
                    {isEditMode ? (
                      <input
                        type="number"
                        min="0"
                        value={currentTargetVal}
                        onChange={(e) => handleTargetInputChange(row.month, currentSubTabConfig.targetKey, e.target.value)}
                        style={{
                          width: '90px',
                          textAlign: 'right',
                          padding: '4px 8px',
                          borderRadius: theme.radius.sm,
                          border: `1px solid ${theme.color.primary}`,
                          fontWeight: 700
                        }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, color: theme.color.textPrimary }}>{currentTargetVal}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: theme.color.textSecondary }}>{currentActualVal}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: theme.color.textPrimary }}>
                    {currentRatioVal}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
