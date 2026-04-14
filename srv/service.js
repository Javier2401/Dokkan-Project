module.exports = cds.service.impl(async function() {
    this.on('getTopCharacters', async (req) => {
        const { type } = req.data;
        return await SELECT.from('my.dokkanproject.Character')
            .where({ type })
            .orderBy('atk desc')
            .limit(10);
    });
});