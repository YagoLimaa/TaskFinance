"use client";

import { useUserContext } from "@/context/UserContext";
import useRedirect from "@/hook/useUserRedirect";
import { useRouter } from "next/navigation"; // Importa o useRouter
import "./styles.css";
import {
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function PaginaInicial() {
  useRedirect("/login");

  const contextoUsuario = useUserContext();
  const { usuario } = contextoUsuario || {};
  const { emailVerificado } = usuario || {};
  const router = useRouter(); // Instância do useRouter

  const handleNavigation = (path: string) => {
    router.push(path); // Redireciona para a rota especificada
  };

  return (
    <div className="page-container">
      {/* Header/Navbar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <div className="logo-icon">TF</div>
            <span className="logo-text">TaskFinance</span>
          </div>
          <nav className="navbar-links">
            <button onClick={() => handleNavigation("/tarefas")} className="navbar-link">Tarefas</button>
            <button onClick={() => handleNavigation("/recursos")} className="navbar-link">Recursos</button>
            <button onClick={() => handleNavigation("/sobre")} className="navbar-link">Sobre</button>
            <button onClick={() => handleNavigation("/preco")} className="navbar-link">Preços</button>
            <button onClick={() => handleNavigation("/login")} className="navbar-button">Começar</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-tagline fade-in">Gerencie suas finanças com facilidade</div>
            <h1 className="hero-title slide-in">
              Gestão Financeira<br />
              <span className="highlight">Inteligente</span><br />
              para Todos
            </h1>
            <p className="hero-description fade-in">
              Simplifique sua vida financeira com o TaskFinance. Acompanhe despesas, defina
              orçamentos e alcance seus objetivos financeiros com nossas ferramentas intuitivas.
            </p>
          </div>
          <div className="hero-image fade-in">
            <div className="finance-cards">
              {/* Card de Income */}
              <div className="finance-card">
                <div className="finance-card-icon green">
                  <TrendingUp />
                </div>
                <div className="finance-card-info">
                  <p className="finance-card-label">Renda</p>
                  <p className="finance-card-value">R$12.750</p>
                </div>
                <div className="finance-card-change green">
                  <ArrowUpRight />
                  <span>12%</span>
                </div>
              </div>

              {/* Card de Expenses */}
              <div className="finance-card">
                <div className="finance-card-icon red">
                  <TrendingUp className="rotated" />
                </div>
                <div className="finance-card-info">
                  <p className="finance-card-label">Despesas</p>
                  <p className="finance-card-value">R$7.250</p>
                </div>
                <div className="finance-card-change red">
                  <ArrowDownRight />
                  <span>8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks Section */}
      <section id="tasks" className="tasks-section fade-in">
        <h2 className="tasks-title">Gerencie Suas Tarefas com Facilidade</h2>
        <p className="tasks-description">
          Organize suas tarefas diárias, semanais e mensais para alcançar seus objetivos com eficiência.
        </p>
        <div className="tasks-cards">
          {/* Card de Tarefa 1 */}
          <div className="task-card">
            <div className="task-card-icon green">
              <TrendingUp />
            </div>
            <div className="task-card-info">
              <p className="task-card-label">Tarefas Diárias</p>
              <p className="task-card-description">
                Gerencie suas tarefas diárias para manter o foco e a produtividade.
              </p>
            </div>
          </div>

          {/* Card de Tarefa 2 */}
          <div className="task-card">
            <div className="task-card-icon blue">
              <TrendingUp />
            </div>
            <div className="task-card-info">
              <p className="task-card-label">Planejamento Semanal</p>
              <p className="task-card-description">
                Organize suas tarefas financeiras e pessoais para a semana e mantenha o controle.
              </p>
            </div>
          </div>

          {/* Card de Tarefa 3 */}
          <div className="task-card">
            <div className="task-card-icon purple">
              <TrendingUp />
            </div>
            <div className="task-card-info">
              <p className="task-card-label">Metas Mensais</p>
              <p className="task-card-description">
                Defina metas financeiras e de produtividade e acompanhe seu progresso ao longo do mês.
              </p>
            </div>
          </div>
        </div>

        {/* Botões abaixo dos cartões */}
        <div className="tasks-buttons">
          <button onClick={() => handleNavigation("/login")} className="button primary">
            <span>Começar Agora</span>
            <ArrowRight className="button-icon-inline" />
          </button>
          <button onClick={() => handleNavigation("/sobre")} className="button secondary">Saiba Mais</button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="features-title slide-in">Recursos Inteligentes para Finanças e Tarefas</h2>
          <p className="features-description fade-in">
            Ferramentas projetadas para simplificar sua jornada financeira e gerenciar suas tarefas com eficiência.
          </p>
          <div className="features-grid fade-in">
            <div className="feature-card">
              <div className="feature-icon blue">
                <TrendingUp />
              </div>
              <h3 className="feature-title">Acompanhamento Financeiro</h3>
              <p className="feature-description">
                Obtenha uma visão completa de suas finanças com gráficos intuitivos e relatórios personalizados.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue">
                <TrendingUp />
              </div>
              <h3 className="feature-title">Gestão de Tarefas</h3>
              <p className="feature-description">
                Organize suas tarefas financeiras e pessoais, defina prazos e acompanhe seu progresso.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue">
                <TrendingUp />
              </div>
              <h3 className="feature-title">Análise Inteligente</h3>
              <p className="feature-description">
                Receba insights personalizados com base nos seus hábitos de gastos e produtividade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-columns">
            <div className="footer-column">
              <h3 className="footer-title">Produto</h3>
              <ul className="footer-links">
                <li><button onClick={() => handleNavigation("/recursos")} className="footer-link">Recursos</button></li>
                <li><button onClick={() => handleNavigation("/preco")} className="footer-link">Preços</button></li>
                <li><button onClick={() => handleNavigation("/app")} className="footer-link">Aplicativo</button></li>
                <li><button onClick={() => handleNavigation("/integracoes")} className="footer-link">Integrações</button></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Empresa</h3>
              <ul className="footer-links">
                <li><button onClick={() => handleNavigation("/sobre")} className="footer-link">Sobre</button></li>
                <li><button onClick={() => handleNavigation("/blog")} className="footer-link">Blog</button></li>
                <li><button onClick={() => handleNavigation("/carreiras")} className="footer-link">Carreiras</button></li>
                <li><button onClick={() => handleNavigation("/contato")} className="footer-link">Contato</button></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Recursos</h3>
              <ul className="footer-links">
                <li><button onClick={() => handleNavigation("/conhecimento")} className="footer-link">Base de Conhecimento</button></li>
                <li><button onClick={() => handleNavigation("/suporte")} className="footer-link">Suporte</button></li>
                <li><button onClick={() => handleNavigation("/tutoriais")} className="footer-link">Tutoriais</button></li>
                <li><button onClick={() => handleNavigation("/faq")} className="footer-link">FAQ</button></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Legal</h3>
              <ul className="footer-links">
                <li><button onClick={() => handleNavigation("/privacidade")} className="footer-link">Privacidade</button></li>
                <li><button onClick={() => handleNavigation("/termos")} className="footer-link">Termos</button></li>
                <li><button onClick={() => handleNavigation("/cookies")} className="footer-link">Cookies</button></li>
                <li><button onClick={() => handleNavigation("/conformidade")} className="footer-link">Conformidade</button></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-logo">
              <div className="logo-icon">TF</div>
              <span className="logo-text">TaskFinance</span>
            </div>
            <p className="footer-copyright">
              © 2025 TaskFinance. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}