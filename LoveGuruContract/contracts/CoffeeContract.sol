pragma solidity ^0.8.19;

contract CoffeeContract {
    address payable public constant RECIPIENT = payable(0x831E8E37aE66636193D070D37bC601d1F30fE0B9);
    uint256 public constant COFFEE_PRICE = 0.0001 ether;

    event CoffeeBought(address buyer, uint256 amount);

    function buyCoffee() public payable {
        require(msg.value == COFFEE_PRICE, "Incorrect amount sent");
        RECIPIENT.transfer(msg.value);
        emit CoffeeBought(msg.sender, msg.value);
    }
}
