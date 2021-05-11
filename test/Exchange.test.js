import { tokens, EVM_REVERT,ETHER_ADDRESS, ether } from './helpers'

const Exchange = artifacts.require('./Exchange');
const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Exchange', ([deployer, feeAccount, user1]) => {
    let exchange;
    let token;
    const feePercent = 10;

    beforeEach(async () => {
        //Deploy Token
        token = await Token.new();

        //Transfer some tokens to user1
        token.transfer(user1, tokens(100), { from: deployer });

        //deploy exchange
        exchange = await Exchange.new(feeAccount, feePercent);
    })

    describe('deployment', () => {
        it('tracks the fee account', async () => {
            const result = await exchange.feeAccount();
            result.should.equal(feeAccount);
        })

        it('tracks the fee percent', async () => {
            const result = await exchange.feePercent();
            result.toString().should.equal(feePercent.toString());
        })


    })

    describe('depositing Ether', async ()=>{
        let result; 
        let amount = ether(1); 
        beforeEach(async () =>{
            result = await exchange.depositEther({from: user1, value: amount });
        })

        it('tracks the Ether deposit', async() => {
            const balance = await exchange.tokens(ETHER_ADDRESS, user1);
            balance.toString().should.equal(amount.toString());
        })

        it('It emits a Ether event', async () => {
            const log = result.logs[0];
            log.event.should.eq('Deposit');
            const event = log.args;
            event.token.toString().should.eq(ETHER_ADDRESS, 'from is correct');
            event.user.toString().should.eq(user1, "_to is correct");
            event.amount.toString().should.eq(amount.toString(), "value is correct");
            event.balance.toString().should.eq(amount.toString(), "value is correct");
        })
    })

    describe("Fallback", () => {
        it('reverts when either is sent', async () => {
            await exchange.sendTransaction({ value: 1 , from: user1}).should.be.rejectedWith(EVM_REVERT);
        })
    })

    describe('depositing tokens', () => {
        let result;
        let amount;

        describe('success', () => {
            beforeEach(async () => {
                amount = tokens(10)
                await token.approve(exchange.address, amount, { from: user1 })
                result = await exchange.depositToken(token.address, amount, { from: user1 })
            })

            it('tracks the token deposit', async () => {
                // Check exchange token balance
                let balance
                balance = await token.balanceOf(exchange.address);
                balance.toString().should.equal(amount.toString());
                // Check tokens on exchange
                balance = await exchange.tokens(token.address, user1);
                balance.toString().should.equal(amount.toString());
            })
            it('It emits a deposit event', async () => {
                const log = result.logs[0];
                log.event.should.eq('Deposit');
                const event = log.args;
                event.token.toString().should.eq(token.address, 'from is correct');
                event.user.toString().should.eq(user1, "_to is correct");
                event.amount.toString().should.eq(amount.toString(), "value is correct");
                event.balance.toString().should.eq(amount.toString(), "value is correct");
            })
        })
        describe("Failure", () => {
            it('reject ether deposits', async () => {
                //TODO: fill me in
                await exchange.depositToken(ETHER_ADDRESS, amount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
            })

            it('fails no tokens are approved', async () => {
                await exchange.depositToken(token.address, amount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
            })

        })

    })

})