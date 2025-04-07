"use client";

import Navbar from "@/app/Components/Navbar/Navbar"; // Importa a Navbar
import { TrendingUp, CheckCircle, ClipboardList, List, BarChart2 } from "lucide-react";
import "@/app/styles.css";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter(); // Instância do useRouter para navegação

  const handleNavigation = (path: string) => {
    router.push(path); // Redireciona para a rota especificada
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <Navbar />

      {/* Layout Principal */}
      <div className="dashboard-layout">
        {/* Barra Lateral */}
        <aside className="dashboard-sidebar">
          <button
            onClick={() => handleNavigation("/dashboardFinance")}
            className="sidebar-button"
          >
            <BarChart2 className="sidebar-icon" />
            Dashboard Financeiro
          </button>
          <button
            onClick={() => handleNavigation("/dashboardTask")}
            className="sidebar-button"
          >
            <List className="sidebar-icon" />
            Dashboard de Tarefas
          </button>
        </aside>

        {/* Conteúdo Principal */}
        <div className="dashboard-content">
          {/* Relatórios */}
          <div className="dashboard-reports">
            <h2 className="dashboard-title">Relatórios de Finanças</h2>
            <div className="report-card">
              <div className="report-icon green">
                <TrendingUp />
              </div>
              <div className="report-info">
                <p className="report-label">Renda Total</p>
                <p className="report-value">R$12.750</p>
              </div>
            </div>
            <div className="report-card">
              <div className="report-icon red">
                <TrendingUp className="rotated" />
              </div>
              <div className="report-info">
                <p className="report-label">Despesas Totais</p>
                <p className="report-value">R$7.250</p>
              </div>
            </div>
            <div className="report-card">
              <div className="report-icon blue">
                <ClipboardList />
              </div>
              <div className="report-info">
                <p className="report-label">Saldo Atual</p>
                <p className="report-value">R$5.500</p>
              </div>
            </div>

            <h2 className="dashboard-title">Relatórios de Tarefas</h2>
            <div className="report-card">
              <div className="report-icon purple">
                <CheckCircle />
              </div>
              <div className="report-info">
                <p className="report-label">Tarefas Concluídas</p>
                <p className="report-value">45</p>
              </div>
            </div>
            <div className="report-card">
              <div className="report-icon orange">
                <ClipboardList />
              </div>
              <div className="report-info">
                <p className="report-label">Tarefas Pendentes</p>
                <p className="report-value">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}