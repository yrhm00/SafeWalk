export const readProduct = async (SQLClient, {id}) => {
    const {rows} = await SQLClient.query("SELECT * FROM product WHERE id = $1", [id]);
    return rows[0];
};