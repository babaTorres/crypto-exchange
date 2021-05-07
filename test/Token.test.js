import { invalid } from 'moment';
import {tokens,EVM_REVERT} from './helpers'

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

    describe('Sending Tokens', () => {
        let amount;
        let result;

        describe('Success', () => {

            beforeEach(async () => {
                amount = tokens(100);
                result = await token.transfer(receiver, amount, { from: deployer })
            })
            it('Able to tranfer token balances', async () => {
                let balanceOf;

                balanceOf = await token.balanceOf(deployer);
                balanceOf.toString().should.equal(tokens(999900).toString())
                balanceOf = await token.balanceOf(receiver);
                balanceOf.toString().should.equal(tokens(100).toString());

            })
            it('It emits a transfer event', async () => {
                const log = result.logs[0];
                log.event.should.eq('Transfer');
                const event = log.args;
                event.from.toString().should.eq(deployer, 'from is correct');
                event.to.toString().should.eq(receiver, "_to is correct");
                event.value.toString().should.eq(amount.toString(), "value is correct");
            })
        })

        describe('Failure', () => {
            it("Reject insuffceint balances", async ()=>{

                let invalidAmount
                invalidAmount = tokens(100000000);
                await token.transfer(receiver,invalidAmount,{from: deployer}).should.be.rejectedWith(EVM_REVERT);

                invalidAmount = tokens(10);
                await token.transfer(deployer,invalidAmount,{from: receiver}).should.be.rejectedWith(EVM_REVERT);
            })

            it('Invalid recipients', async ()=>{
                await token.transfer(0x0, amount, {from: deployer}).should.be.rejected;
            })
           
        })
    })
})