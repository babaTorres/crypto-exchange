import {tokens} from './helpers'

const Token = artifacts.require('./Token'); 

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Token', ([deployer, receiver])=> {
    let token;
    const name = 'CarliCoin';
    const symbol = 'CFR'; 
    const decimals = '18';
    const totalSupply = tokens(1000000).toString();
 
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
            result.toString().should.equal(totalSupply.toString()); 
        })

        it('Assign total supply to the deployer', async()=>{
            const result = await token.balanceOf(deployer); 
            result.toString().should.equal(totalSupply.toString());
        })

    })

    describe('Sending Tokens', ()=> {
        it('Able to tranfer token balances', async()=>{
            let balanceOf;
            balanceOf = await token.balanceOf(deployer);
            console.log('deployer balance' + balanceOf); 
            balanceOf = await token.balanceOf(receiver);  
            console.log('deployer balance' + balanceOf.toString());

            //Transer
            await token.transfer(receiver, tokens(100), {from: deployer})
            //After Transfer

            balanceOf = await token.balanceOf(deployer);
            balanceOf.toString().should.equal(tokens(999900).toString())
            console.log('deployer balance' + balanceOf); 
            balanceOf = await token.balanceOf(receiver);  
            balanceOf.toString().should.equal(tokens(100).toString());
            console.log('receiver balance' + balanceOf.toString());
            
        })

    })
})