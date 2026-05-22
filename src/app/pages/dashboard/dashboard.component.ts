import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';

// ─── Constantes ──────────────────────────────────────────────────────────────
const PACK_COST    = 7.11;
const LOT_PACKS    = 400;
const LOT_MP_COST  = 1876.28;
const LOT_FULL     = LOT_PACKS * PACK_COST; // R$ 2.844,00

const MONTHLY_PACKS = [90, 65, 125, 150, 205, 265, 315, 225, 250, 335, 280, 400];
const MONTH_LABELS  = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function profit(packs: number, price: number) { return +(packs * price - LOT_FULL).toFixed(2); }
function revenue(packs: number, price: number) { return +(packs * price).toFixed(2); }

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface SubScenario {
  label: string; icon: string; packs: number; pct: number;
  revenue: number; profit: number; margin: number; isProfit: boolean;
}
export interface PriceScenario {
  name: string; price: number; color: string; bgColor: string;
  borderColor: string; breakEvenPacks: number; sub: SubScenario[];
}
export interface MonthEvent {
  month: number; abbr: string; label: string;
  type: 'up' | 'down' | 'neutral'; detail: string;
}
export interface AnnualKpi {
  name: string; price: number; color: string;
  totalProfit: number; totalRevenue: number;
  profitableMonths: number; breakEvenMonth: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl:    './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  // Constantes expostas ao template
  readonly lotCost   = LOT_FULL;
  readonly packCost  = PACK_COST;
  readonly lotPacks  = LOT_PACKS;
  readonly lotMP     = LOT_MP_COST;
  readonly monthLabels = MONTH_LABELS;

  // ─── Cenários de preço × venda ─────────────────────────────────────────────
  priceScenarios: PriceScenario[] = [];
  annualKpis:     AnnualKpi[]    = [];

  readonly priceDefs = [
    { name: 'Entrada', price: 14.90, color: '#ada749', bgColor: 'rgba(173,167,73,0.10)', borderColor: 'rgba(173,167,73,0.35)' },
    { name: 'Padrão',  price: 19.90, color: '#2ea05c', bgColor: 'rgba(46,160,92,0.10)',  borderColor: 'rgba(46,160,92,0.35)'  },
    { name: 'Premium', price: 24.90, color: '#6d4fc4', bgColor: 'rgba(109,79,196,0.10)', borderColor: 'rgba(109,79,196,0.35)' },
  ];

  private readonly salesBuckets = [
    { label: 'Pior Venda',   icon: 'pi-arrow-down-right', packs: 200, pct: 50  },
    { label: 'Venda Básica', icon: 'pi-minus',             packs: 300, pct: 75 },
    { label: 'Melhor Venda', icon: 'pi-arrow-up-right',    packs: 400, pct: 100 },
  ];

  // ─── Eventos mensais ───────────────────────────────────────────────────────
  readonly monthEvents: MonthEvent[] = [
    { month: 0,  abbr: 'Jan', label: 'Lançamento',        type: 'neutral', detail: 'Produto entra no mercado. Canais em formação, vendas cautelosas.' },
    { month: 1,  abbr: 'Fev', label: 'Queda — Carnaval',  type: 'down',    detail: 'Feriados e festas reduzem foco em saúde. Pior mês do ano (−28%).' },
    { month: 2,  abbr: 'Mar', label: '1ºs Atacadistas',   type: 'up',      detail: 'Primeiros revendedores fecham contrato. Volume sobe +92%.' },
    { month: 6,  abbr: 'Jul', label: 'Parceria Academia', type: 'up',      detail: 'Parceria com rede de academias. Melhor mês do 1º semestre.' },
    { month: 7,  abbr: 'Ago', label: 'Ajuste Estoque',    type: 'down',    detail: 'Canal pausa para girar estoque. Queda de −28% no volume.' },
    { month: 9,  abbr: 'Out', label: 'Influencer Boost',  type: 'up',      detail: 'Ação com influencer fitness. +34% vs. setembro.' },
    { month: 11, abbr: 'Dez', label: 'Natal Esgotado',    type: 'up',      detail: '400 packs vendidos — lote completo. Maior lucro do ano.' },
  ];

  // ─── Estado dos filtros ───────────────────────────────────────────────────
  selectedMetric: 'profit' | 'revenue' | 'volume' = 'profit';
  rangeStart = 0;
  rangeEnd   = 11;
  activeScenarios: Record<string, boolean> = { Entrada: true, Padrão: true, Premium: true };

  readonly metricOptions = [
    { key: 'profit'  as const, label: 'Lucro Bruto',   icon: 'pi-chart-line'  },
    { key: 'revenue' as const, label: 'Receita Bruta', icon: 'pi-dollar'      },
    { key: 'volume'  as const, label: 'Packs Vendidos', icon: 'pi-box'        },
  ];

  readonly rangePresets = [
    { label: 'Q1',        start: 0,  end: 2  },
    { label: 'Q2',        start: 3,  end: 5  },
    { label: 'Q3',        start: 6,  end: 8  },
    { label: 'Q4',        start: 9,  end: 11 },
    { label: '1º Sem.',   start: 0,  end: 5  },
    { label: '2º Sem.',   start: 6,  end: 11 },
    { label: 'Ano Todo',  start: 0,  end: 11 },
  ];

  // ─── Escala vertical (Y-axis) ─────────────────────────────────────────────
  yMin = -3000;
  yMax = 7500;
  yAuto = false;
  readonly Y_MIN_LIMIT = -5000;
  readonly Y_MAX_LIMIT = 10000;
  readonly Y_STEP      = 500;

  onYMinChange(e: Event) {
    this.yMin  = +(e.target as HTMLInputElement).value;
    this.yAuto = false;
    this.rebuildChart();
  }
  onYMaxChange(e: Event) {
    this.yMax  = +(e.target as HTMLInputElement).value;
    this.yAuto = false;
    this.rebuildChart();
  }
  resetYAxis() {
    this.yAuto = true;
    this.yMin  = -3000;
    this.yMax  = 7500;
    this.rebuildChart();
  }
  fmtY(v: number): string {
    if (v === 0) return 'R$ 0';
    const abs  = Math.abs(v);
    const sign = v < 0 ? '-' : '+';
    return abs >= 1000 ? `${sign}R$${(abs / 1000).toFixed(1)}k` : `${sign}R$${abs}`;
  }
  fillPct(value: number, min: number, max: number): string {
    return (((value - min) / (max - min)) * 100).toFixed(1) + '%';
  }

  // ─── Dados do gráfico ──────────────────────────────────────────────────────
  /** Altura do canvas — 100% do container (.lc-chart-outer define o tamanho) */
  readonly chartHeight = '100%';
  lineChartData:    any;
  lineChartOptions: any;

  // ─── Getters ───────────────────────────────────────────────────────────────
  get visibleEvents(): MonthEvent[] {
    return this.monthEvents.filter(e => e.month >= this.rangeStart && e.month <= this.rangeEnd);
  }

  get currentMetricLabel(): string {
    return this.metricOptions.find(m => m.key === this.selectedMetric)?.label ?? '';
  }

  // ─── Init ──────────────────────────────────────────────────────────────────
  ngOnInit() {
    this.buildScenarios();
    this.buildAnnualKpis();
    this.rebuildChart();
  }

  // ─── Construção dos cenários ───────────────────────────────────────────────
  private buildScenarios() {
    this.priceScenarios = this.priceDefs.map(p => {
      const sub: SubScenario[] = this.salesBuckets.map(s => {
        const rev  = s.packs * p.price;
        const prf  = rev - LOT_FULL;
        const mrgn = (prf / rev) * 100;
        return { label: s.label, icon: s.icon, packs: s.packs, pct: s.pct,
                 revenue: rev, profit: prf, margin: mrgn, isProfit: prf >= 0 };
      });
      return { ...p, breakEvenPacks: Math.ceil(LOT_FULL / p.price), sub };
    });
  }

  private buildAnnualKpis() {
    this.annualKpis = this.priceDefs.map(p => {
      const monthly = MONTHLY_PACKS.map(pk => profit(pk, p.price));
      let acc = 0;
      const cumul = monthly.map(v => (acc += v));
      const beIdx = cumul.findIndex(v => v > 0);
      return {
        name: p.name, price: p.price, color: p.color,
        totalProfit:      +monthly.reduce((a, b) => a + b, 0).toFixed(2),
        totalRevenue:     +MONTHLY_PACKS.reduce((s, pk) => s + pk * p.price, 0).toFixed(2),
        profitableMonths: monthly.filter(v => v > 0).length,
        breakEvenMonth:   beIdx >= 0 ? MONTH_LABELS[beIdx] : '—',
      };
    });
  }

  // ─── Ações dos filtros ─────────────────────────────────────────────────────
  setMetric(m: 'profit' | 'revenue' | 'volume') {
    this.selectedMetric = m;
    this.rebuildChart();
  }

  setRange(start: number, end: number) {
    this.rangeStart = start;
    this.rangeEnd   = end;
    this.rebuildChart();
  }

  toggleScenario(name: string) {
    const activeCount = Object.values(this.activeScenarios).filter(Boolean).length;
    if (activeCount === 1 && this.activeScenarios[name]) return; // manter pelo menos 1
    this.activeScenarios = { ...this.activeScenarios, [name]: !this.activeScenarios[name] };
    this.rebuildChart();
  }

  isRangeActive(start: number, end: number) {
    return this.rangeStart === start && this.rangeEnd === end;
  }

  // ─── Reconstrução do gráfico ───────────────────────────────────────────────
  rebuildChart() {
    const s      = this.rangeStart;
    const e      = this.rangeEnd + 1;
    const labels = MONTH_LABELS.slice(s, e);
    const packs  = MONTHLY_PACKS.slice(s, e);
    const isVol  = this.selectedMetric === 'volume';

    const evIdxSet = new Set(this.monthEvents.map(ev => ev.month));
    const ptRadius = (relI: number) => evIdxSet.has(s + relI) ? 9 : 5;
    const ptColor  = (relI: number, fallback: string) => {
      const ev = this.monthEvents.find(ev => ev.month === s + relI);
      if (!ev) return fallback;
      return ev.type === 'up' ? '#4ade80' : ev.type === 'down' ? '#f87171' : '#fbbf24';
    };

    const datasets: any[] = [];

    if (isVol) {
      // ── Volume: 1 linha dourada + referências ──────────────────────────────
      datasets.push(
        { label: '_zero_ref', data: Array(e - s).fill(0), borderColor: 'transparent', borderWidth: 0, pointRadius: 0, fill: false },
        {
          label: 'Packs Vendidos / Mês',
          data: packs,
          borderColor: '#ada749', backgroundColor: 'rgba(173,167,73,0.08)',
          borderWidth: 3, tension: 0.42, fill: true,
          pointRadius: packs.map((_, i) => ptRadius(i)),
          pointBackgroundColor: packs.map((_, i) => ptColor(i, '#ada749')),
          pointBorderColor: '#0a180d', pointBorderWidth: 2, pointHoverRadius: 12,
        },
        { label: 'Break-even Padrão (143 packs)', data: Array(e-s).fill(143), borderColor: 'rgba(46,160,92,0.5)', borderDash: [6,4], borderWidth: 1.5, pointRadius: 0, fill: false, tension: 0 },
        { label: 'Meta — Lote Completo (400 packs)', data: Array(e-s).fill(400), borderColor: 'rgba(109,79,196,0.45)', borderDash: [6,4], borderWidth: 1.5, pointRadius: 0, fill: false, tension: 0 }
      );
    } else {
      // ── Lucro / Receita: linha de ref + 1–3 linhas ─────────────────────────
      datasets.push({
        label: '_zero_ref',
        data: Array(e - s).fill(0),
        borderColor: 'rgba(255,255,255,0.14)',
        borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0, fill: false, tension: 0,
      });

      for (const p of this.priceDefs) {
        if (!this.activeScenarios[p.name]) continue;
        const vals = this.selectedMetric === 'profit'
          ? packs.map(pk => profit(pk, p.price))
          : packs.map(pk => revenue(pk, p.price));
        const fill = this.selectedMetric === 'profit'
          ? { target: { value: 0 }, above: p.bgColor.replace('0.10', '0.12'), below: 'rgba(248,113,113,0.09)' }
          : { target: 'origin', above: p.bgColor.replace('0.10', '0.09') };

        datasets.push({
          label: `${p.name} — R$${p.price.toFixed(2)}`,
          data: vals,
          borderColor: p.color, backgroundColor: p.bgColor.replace('0.10', '0.06'),
          borderWidth: 2.5, tension: 0.42, fill,
          pointRadius:          packs.map((_, i) => ptRadius(i)),
          pointBackgroundColor: packs.map((_, i) => ptColor(i, p.color)),
          pointBorderColor: '#0a180d', pointBorderWidth: 2,
          pointHoverRadius: 12,
        });
      }
    }

    // ── Calcular range do eixo Y — sempre alinhado a R$500 ───────────────────
    let yMin: number, yMax: number;
    if (isVol) {
      const maxPacks = Math.max(...packs, 400, 143);
      yMin = 0;
      yMax = Math.ceil((maxPacks * 1.12) / 50) * 50;
    } else if (this.yAuto) {
      // Coletar todos os valores dos datasets ativos para auto-range
      const allVals: number[] = [0];
      for (const p of this.priceDefs) {
        if (!this.activeScenarios[p.name]) continue;
        (this.selectedMetric === 'profit'
          ? packs.map(pk => profit(pk, p.price))
          : packs.map(pk => revenue(pk, p.price))
        ).forEach(v => allVals.push(v));
      }
      const dataMin = Math.min(...allVals);
      const dataMax = Math.max(...allVals);
      yMin = Math.floor((dataMin - 500) / 500) * 500;
      yMax = Math.ceil((dataMax  + 500) / 500) * 500;
    } else {
      yMin = this.yMin;
      yMax = this.yMax;
    }

    const tt = {
      backgroundColor: '#0a180d', borderColor: 'rgba(173,167,73,0.3)', borderWidth: 1,
      titleColor: '#e8e4c0', bodyColor: '#aabcaa', padding: 16, cornerRadius: 10,
      titleFont: { size: 12, weight: '700' }, bodyFont: { size: 11 },
    };
    const gridColor = 'rgba(255,255,255,0.055)';
    const textColor = '#7a8a7a';

    this.lineChartData    = { labels, datasets };
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 550, easing: 'easeInOutCubic' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor, font: { size: 12 }, boxWidth: 14, padding: 20,
            filter: (item: any) => !item.text.startsWith('_'),
          },
        },
        tooltip: {
          ...tt,
          callbacks: {
            title: (items: any[]) => {
              const absI = s + items[0].dataIndex;
              const ev = this.monthEvents.find(ev => ev.month === absI);
              return ev ? `${MONTH_LABELS[absI]}  ·  📌 ${ev.label}` : MONTH_LABELS[absI];
            },
            label: (ctx: any) => {
              if (ctx.dataset.label?.startsWith('_')) return null;
              const v = ctx.parsed.y as number;
              if (isVol) return ` ${ctx.dataset.label}: ${v} packs`;
              const sign = v >= 0 ? '▲ ' : '▼ ';
              return ` ${ctx.dataset.label}: ${sign}R$ ${Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            },
            afterBody: (items: any[]) => {
              const absI = s + items[0].dataIndex;
              const ev = this.monthEvents.find(ev => ev.month === absI);
              return ev ? ['', ev.detail] : [];
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor, drawBorder: false },
          ticks: { color: textColor, font: { size: 12 }, padding: 8 },
          border: { color: 'rgba(255,255,255,0.08)' },
        },
        y: {
          min: yMin,
          max: yMax,
          grace: isVol ? '8%' : '5%',
          grid: { color: gridColor, drawBorder: false },
          border: { color: 'rgba(255,255,255,0.08)', dash: [4, 4] },
          ticks: {
            color: textColor,
            font: { size: 11 },
            padding: 12,
            stepSize: isVol ? Math.max(50, Math.round(yMax / 8 / 50) * 50) : 500,
            callback: (v: number) => {
              if (isVol) return `${v}`;
              const n = +v;
              if (n === 0) return 'R$ 0';
              const abs = Math.abs(n).toLocaleString('pt-BR');
              return n > 0 ? `+R$ ${abs}` : `-R$ ${abs}`;
            },
          },
        },
      },
    };
  }

  formatBRL(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
