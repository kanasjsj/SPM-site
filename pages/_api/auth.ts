// pages/api/auth.js
import { getAuth, clerkClient } from '@clerk/nextjs/server'
import { gerarNRG } from '../../utils/auth'  // Importando a função gerarNRG
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  // Gerando o NRG para o usuário
  const nrg = gerarNRG()

  // Aqui você pode salvar o NRG gerado no banco de dados do usuário, caso necessário.
  // Exemplo: Atualize o banco com o NRG gerado

  return res.status(200).json({ user: user, nrg: nrg })
}