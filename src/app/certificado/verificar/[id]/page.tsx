import { Award, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

// Em produção, buscar do banco de dados pelo código do certificado
// Por ora, rota de verificação pública simples
export default async function VerificarCertificadoPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // Placeholder de verificação — integrar com banco de dados em produção
    const isValid = id.startsWith('LIDERA-')

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
            <div className="max-w-lg w-full text-center space-y-6">
                <div className={`inline-flex p-5 rounded-2xl border-2 ${isValid
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    {isValid
                        ? <CheckCircle className="h-14 w-14 text-green-400" />
                        : <XCircle className="h-14 w-14 text-red-400" />
                    }
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {isValid ? 'Certificado Autêntico' : 'Certificado Não Encontrado'}
                    </h1>
                    <p className="text-slate-400">
                        {isValid
                            ? `O certificado de código ${id} é autêntico e foi emitido pela Lidera Treinamentos.`
                            : 'Não encontramos nenhum certificado com este código. Verifique se o código está correto.'
                        }
                    </p>
                </div>

                {isValid && (
                    <div className="bg-slate-900 border border-white/5 rounded-xl p-5 text-left space-y-3">
                        <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-400" />
                            <span className="text-sm font-semibold text-white">Lidera Treinamentos</span>
                        </div>
                        <p className="text-xs text-slate-500">Código: <span className="text-slate-300 font-mono">{id}</span></p>
                        <p className="text-xs text-slate-500">Plataforma de Educação Corporativa e Desenvolvimento de Liderança</p>
                    </div>
                )}

                <Link href="/"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                    Conhecer a Lidera
                </Link>
            </div>
        </div>
    )
}
