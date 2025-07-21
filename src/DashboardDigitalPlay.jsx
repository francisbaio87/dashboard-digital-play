import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';


const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKr7FgEUpz2AtPXj-m5ijT7QSGUXoNQx_BhzS11pa4/pub?output=csv&cachebust=" + Date.now();


export default function DashboardDigitalPlay() {
  const [dados, setDados] = useState([]);
  const [resumo, setResumo] = useState({
    receitaTotal: 0,
    vendasConfirmadas: 0,
    CPA: 0,
    ROI: 0
  });

  const fetchData = () => {
    fetch(SPREADSHEET_URL)
      .then((res) => res.text())
      .then((csv) => {
        const linhas = csv.split("\n");
        const cabecalho = linhas[0].split(",");

        const statusIndex = cabecalho.findIndex(h => h.trim().toLowerCase() === "status");
        const obsIndex = cabecalho.findIndex(h => h.trim().toLowerCase() === "observações");
        const dataIndex = cabecalho.findIndex(h => h.trim().toLowerCase().includes("data"));
        const investidoIndex = cabecalho.findIndex(h => h.trim().toLowerCase().includes("valor investido"));

        let totalReceita = 0;
        let vendas = 0;
        let valorInvestido = 0;
        const porData = {};

        for (let i = 1; i < linhas.length; i++) {
          const colunas = linhas[i].split(",");
          const status = colunas[statusIndex]?.trim().toLowerCase();
          const obs = colunas[obsIndex]?.trim();
          const data = colunas[dataIndex]?.trim().split(" ")[0];
          const investido = parseFloat(colunas[investidoIndex]?.replace(",", "."));

          if (!isNaN(investido)) {
            valorInvestido = investido;
          }

          if (status === "venda realizada" && obs) {
            const match = obs.match(/(\d+)[xX][^\d]*(\d+[.,]?\d{0,2})/);
            if (match) {
              const parcelas = parseInt(match[1], 10);
              const valorParcela = parseFloat(match[2].replace(",", "."));
              const totalVenda = parcelas * valorParcela;

              totalReceita += totalVenda;
              vendas += 1;

              if (!porData[data]) porData[data] = 0;
              porData[data] += totalVenda;
            }
          }
        }

        const dadosGrafico = Object.entries(porData).map(([data, valor]) => ({
          data,
          valor: parseFloat(valor.toFixed(2))
        }));

        const CPA = vendas > 0 ? valorInvestido / vendas : 0;
        const ROI = valorInvestido > 0 ? ((totalReceita - valorInvestido) / valorInvestido) * 100 : -100;

        setResumo({
          receitaTotal: totalReceita,
          vendasConfirmadas: vendas,
          CPA,
          ROI
        });

        setDados(dadosGrafico);
      });
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5 * 60 * 1000); // a cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Digital Play</h1>
      <p><strong>Receita total:</strong><br />R$ {resumo.receitaTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
      <p><strong>Vendas confirmadas:</strong><br />{resumo.vendasConfirmadas}</p>
      <p><strong>CPA:</strong><br />R$ {resumo.CPA.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
      <p><strong>ROI:</strong><br />{resumo.ROI.toFixed(2)}%</p>

      <h2 style={{ marginTop: "2rem" }}>📊 Comparativo diário</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={dados}>
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
            <Bar dataKey="valor" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
