import {
  beginTransaction,
  rollback,
  commitTransaction,
  getWriteConn,
  queryConnection,
  releaseConnection
} from "../utils/db";

async function updateBoxMonth(memberId, box, month, year) {
  let conn = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let isSwag = [];
    let ignore = await queryConnection(conn, 'DELETE FROM box WHERE member_id = ? AND month = ? AND year = ?;', [memberId, month, year]);
    if(box.length > 0) isSwag = await queryConnection(conn, 'SELECT id, swag FROM product WHERE id IN (?);', [box.map(b=>b ? b : 0)]);
    let updates = box.map((b, i)=>[memberId, b, i === 0, month, year, (i !== 0) * 99.99, 0,
      isSwag.find(s=>s['id'] == b) ? isSwag.find(s=>s['id'] == b)['swag'] : 0]).filter(r=>r[1]);
    if (updates.length > 0)
      await queryConnection(conn, 'INSERT box (member_id, product_id, special, month, year, price, shipped, swag) values ?', [updates]);
    await commitTransaction(conn);
  } catch (e) {
    console.error(e);
    if (conn) await rollback(conn);
  } finally {
    if (conn) await releaseConnection(conn);
  }
}

export async function setBox(memberId, box) {
  let month = (new Date()).getMonth(), year = (new Date()).getYear() - 115;
  return await updateBoxMonth(memberId, box, month, year);
}

export async function setFutureBox(memberId, box) {
  let next = new Date(new Date().setMonth(new Date().getMonth() + 1)), next_month = next.getMonth(), next_year = next.getYear() - 115;
  return await updateBoxMonth(memberId, box, next_month, next_year);
}