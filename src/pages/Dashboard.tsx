import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { StatusCard } from '../components/dashboard/StatusCard';
import { EvolutionChart } from '../components/dashboard/EvolutionChart';
import { CorrelationMatrix } from '../components/dashboard/CorrelationMatrix';
import { MetricGauge } from '../components/dashboard/MetricGauge';
import { AnxietyDistributionChart } from '../components/dashboard/AnxietyDistributionChart';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background text-white flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="max-w-[1200px] mx-auto space-y-6">

                    {/* Header */}
                    <Header userName="Valdemar" streakDays={12} />

                    {/* Daily Actions */}
                    <StatusCard />

                    {/* Charts Grid */}
                    <div className="grid grid-cols-12 gap-6">

                        {/* Evolution Chart - Spans 8 cols */}
                        <div className="col-span-12 lg:col-span-8">
                            <EvolutionChart />
                        </div>

                        {/* Correlation Matrix - Spans 4 cols */}
                        <div className="col-span-12 lg:col-span-4">
                            <CorrelationMatrix />
                        </div>

                        {/* Bottom Row */}

                        {/* HRV Gauge */}
                        <div className="col-span-12 md:col-span-4">
                            <div className="h-[250px]">
                                <MetricGauge
                                    title="HRV"
                                    value={7}
                                    unit="ms"
                                    subtext="VARIABILIDADE CARDÍACA"
                                    color="#3b82f6"
                                />
                            </div>
                        </div>

                        {/* Anxiety Distribution */}
                        <div className="col-span-12 md:col-span-4">
                            <div className="h-[250px]">
                                <AnxietyDistributionChart />
                            </div>
                        </div>

                        {/* Risk Gauge */}
                        <div className="col-span-12 md:col-span-4">
                            <div className="h-[250px]">
                                <MetricGauge
                                    title="Risco Atual"
                                    value={5}
                                    unit="/10"
                                    subtext="IDEAÇÃO SUICIDA"
                                    color="#eab308"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
