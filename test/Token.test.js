const Token = artifacts.require('./Token'); 

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts)=> {
    let token;
    const name = 'CarliCoin';
    const symbol = 'CFR'; 
    const decimals = '18';
    const totalSupply = '1000000000000000000000000';
 
    beforeEach(async () =>{
        token = await Token.new(); 
    })
    
    describe('deployment',()=> {
        it('tracks the name',async ()=> {
            const result = await token.name(); 
            result.should.equal(name); 
        })

        it('tracks the symbol', async()=>{ 
            const result = await token.symbol(); 
            result.should.equal(symbol); 
        })

        it('tracks the decimal', async()=>{
            const result = await token.decimals(); 
            result.toString().should.equal(decimals); 
        })

        it('tracks the total supply', async()=>{
            const result = await token.totalSupply(); 
            result.toString().should.equal(totalSupply); 
        })

        it('Assign total supply to the deployer', async()=>{
            const result = await token.balanceOf(accounts[0]); 
            result.toString().should.equal(tokens(totalSupply));
        })

    })
})