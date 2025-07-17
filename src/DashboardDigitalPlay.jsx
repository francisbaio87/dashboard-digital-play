
import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

const data = [
  { date: '03/07', conversas: 4, vendas: 1, receita: 3816 },
  { date: '04/07', conversas: 12, vendas: 2, receita: 12473.20 },
  { date: '05/07', conversas: 8, vendas: 1, receita: 6236.60 },
  { date: '06/07', conversas: 18, vendas: 3, receita: 18709.80 },
  { date: '07/07', conversas: 20, vendas: 2, receita: 12049.20 },
  { date: '08/07', conversas: 26, vendas: 1, receita: 3816 },
  { date: '09/07', conversas: 65, vendas: 4, receita: 25000 },
]

const totalVendas = data.reduce((sum, item) => sum + item.vendas, 0)
const receitaTotal = data.reduce((sum, item) => sum + item.receita, 0)
const investimentoTotal = 2509.99
const cpa = (investimentoTotal / totalVendas).toFixed(2)
const roi = (((receitaTotal - investimentoTotal) / investimentoTotal) * 100).toFixed(2)

export default function DashboardDigitalPlay() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard – Whats Educador</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm">Impressões</p><p className="text-xl font-bold">178.806</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Alcance</p><p className="text-xl font-bold">94.443</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Cliques no link</p><p className="text-xl font-bold">644</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Conversas iniciadas</p><p className="text-xl font-bold">153</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">CTR no link</p><p className="text-xl font-bold">0,36%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">CPCON</p><p className="text-xl font-bold">R$ 16,41</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Valor investido</p><p className="text-xl font-bold">R$ 2.509,99</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Receita total</p><p className="text-xl font-bold">R$ {receitaTotal.toLocaleString('pt-BR')}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Vendas confirmadas</p><p className="text-xl font-bold">{totalVendas}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">CPA</p><p className="text-xl font-bold">R$ {cpa}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">ROI</p><p className="text-xl font-bold">{roi}%</p></CardContent></Card>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-lg font-bold mb-4">Comparativo diário</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="conversas" stroke="#8884d8" name="Conversas" />
            <Line type="monotone" dataKey="vendas" stroke="#82ca9d" name="Vendas" />
            <Line type="monotone" dataKey="receita" stroke="#f9a825" name="Receita" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
