export async function getBalance(connection, publicKey) {
  return await connection.getBalance(publicKey);
}