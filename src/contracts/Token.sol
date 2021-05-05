// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token{
    using SafeMath for uint;
    string public name = "CarliCoin"; 
    string public symbol = "CFR";
    uint256 public decimals = 18;
    uint256 public totalSupply; 

    //Track Balances
    mapping(address=>uint256) public balanceOf; 
    //Send Tokens
    //mapping(address=>uint) balanceOf; 

    constructor() public {
        totalSupply = 1000000 * (10**decimals); 
        balanceOf[msg.sender] = totalSupply; 
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value); 
        balanceOf[_to] = balanceOf[_to].add(_value);
        return true; 
    }
}