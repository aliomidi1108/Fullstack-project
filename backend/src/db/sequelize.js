import { Sequelize } from 'sequelize'

let sequelizeInstance = null

const getSequelize = () => {
  if (sequelizeInstance) return sequelizeInstance

  const host = process.env.DB_HOST || '127.0.0.1'
  const port = Number(process.env.DB_PORT || 3306)
  const database = process.env.DB_NAME || 'monyway'
  const username = process.env.DB_USER || 'root'
  const password = process.env.DB_PASSWORD ?? ''

  sequelizeInstance = new Sequelize(
    database,
    username,
    password,
    {
      host,
      port,
      dialect: 'mysql',
      logging: false,
    }
  )

  return sequelizeInstance
}

export { getSequelize }
