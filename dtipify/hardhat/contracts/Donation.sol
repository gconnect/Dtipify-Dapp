// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";

contract Donation is ReentrancyGuard, AutomationCompatibleInterface, VRFConsumerBaseV2, ConfirmedOwner {

     using Counters for Counters.Counter;
    Counters.Counter private _creatorIds;
    uint public creatorCounter;

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    bytes32 keyHash =
        0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 3 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 3;
    uint256 public randomWordsNum;
    
    struct CreatorInfo {
       uint id;
       string username;
       string ipfsHash;
       address payable walletAddress;
       string userbio;
       uint donationsReceived;
       string networkOption;
       uint supporters;
       bool verified;
    }

    event CreatorEvent (
       uint id,
       string username,
       address payable walletAddress,
       string ipfsHash,
       string userbio,
       uint donationsReceived,
       string networkOption,
       uint supporters,
       bool verified
    );
    
    // Support struct.
    struct Supporter {
        address from;
        uint256 timestamp;
        string message;
    }

    // Event to emit when a SupporterEvent is created.
    event SupporterEvent(
        address indexed from,
        uint256 timestamp,
        string message
    );

    // Event to emit 

    // payable address can receive ether
    address payable public _owner;
    uint256 interval;
    uint256 lastTimeStamp;
    // payable constructor can receive ether. Assigning the contract deployer as the owner
    constructor(uint64 subscriptionId)
    VRFConsumerBaseV2(0x2eD832Ba664535e5886b75D64C46EB9a228C2610)
    ConfirmedOwner(msg.sender)  {
                COORDINATOR = VRFCoordinatorV2Interface(
            0x2eD832Ba664535e5886b75D64C46EB9a228C2610
        );
        s_subscriptionId = subscriptionId;
        _owner = payable(msg.sender);

        // update every 5 minutes for testing purpose change to every 7 days later
        interval = 5 minutes;
        lastTimeStamp = block.timestamp;
    }

    mapping(address => bool) isAddressExist;
    mapping(string => bool) isUsernameExist;
    mapping(address => uint256) creatorBalance;
    // List of all supporters.
    Supporter[] supporters;
    CreatorInfo[] creatorList;
    CreatorInfo[]  featuredList;
     // function to create new creator account
    function setCreatorDetail(
        string memory _username, 
        string memory _ipfsHash, 
        string memory _userbio, 
        string memory _networkOption) public { 

        // Validation
        require(bytes(_username).length > 0);
        require(bytes(_ipfsHash).length > 0);
        require(bytes(_userbio).length > 0);
        
        uint _donationsReceived;
        uint _supporters;
        bool _verified;
        /**
        *@dev require statment to block multiple entry
        */
        require(isAddressExist[msg.sender] == false, "Address already exist");
        require(isUsernameExist[_username] == false, "Username already exist");
         /* Increment the counter */
        _creatorIds.increment();

        creatorList.push(
            CreatorInfo(
                _creatorIds.current(),
                _username, 
                _ipfsHash, 
                payable(msg.sender), 
                _userbio, 
                _donationsReceived, 
                _networkOption, 
                _supporters, _verified));
        isAddressExist[msg.sender] = true;
        isUsernameExist[_username] = true;
        // emit a Creator event
        emit CreatorEvent (
        _creatorIds.current(),
        _username,
        payable(msg.sender),
        _ipfsHash,
        _userbio,
       _donationsReceived,
       _networkOption,
       _supporters,
       _verified
    );
    }

    // function to get all creators
    function getCreatorCount() public view returns (uint){
        return creatorList.length;
    }

      // Return the entire list of creators
    function getCreatorList() public view returns (CreatorInfo[] memory creators) {
        return creatorList;
    }

       // Return the featured list of creators
    function getFeaturedCreatorList() public view returns (CreatorInfo[] memory creators) {
        return featuredList;
    }

   // Get a single creator by id
    function getCreatorObj(uint _index) public view returns (CreatorInfo memory) {
         return creatorList[_index];
    }

     // function to get creator info
    function getCreatorInfo(uint index) public view
         returns (
         uint id, 
         string memory,  
         string memory, 
         address, 
         string memory, 
         uint, 
         string memory, 
         uint){
        CreatorInfo storage creatorDetail  = creatorList[index];
        return (
        creatorDetail.id,   
        creatorDetail.username, 
        creatorDetail.ipfsHash, 
        creatorDetail.walletAddress, 
        creatorDetail.userbio, 
        creatorDetail.donationsReceived, 
        creatorDetail.networkOption,
        creatorDetail.supporters);
    }

    /**
     * @dev send tip to a creator (sends an ETH tip and leaves a memo)
     * @param _message a nice message from the supporter
     */
    // send tip in native token
    function sendTip(string memory _message, uint _index) 
        public payable nonReentrant {
        
        // Must accept more than 0 ETH for a coffee.
        require(msg.value > 0, "Invalid amount");
        require(msg.sender.balance >= msg.value, "Insufficient balance");
        address _to = creatorList[_index].walletAddress;
        // handle transfer of to the receiver
        (bool success,) = _to.call{value: msg.value}("");
        require(success, "Failed to send Ether");


        creatorList[_index].donationsReceived += msg.value;
        // creatorList[_index].verified = true;

        // record creator balance on the contract
        address creatorAddress = creatorList[_index].walletAddress;
        creatorBalance[creatorAddress] += msg.value;

        // increment the supporter count  
         creatorList[_index].supporters +=1;
   

        // Add the support to storage!
        supporters.push(Supporter(
            msg.sender,
            block.timestamp,
            _message
        ));

        // Emit a Supporter event with details about the support.
        emit SupporterEvent(
            msg.sender,
            block.timestamp,
            _message
        );
    }


    function sendTipERC20(string memory _message, uint _index, 
        uint _amount, address _tokenAddress) 
            public payable nonReentrant {
            
            IERC20 erc20Token = IERC20(_tokenAddress);
            address _to = creatorList[_index].walletAddress;

            // Must accept more than 0 ETH for a coffee.
            require(_amount > 0, "Invalid amount");
            require(msg.sender.balance >= _amount, "Insufficient balance");

            // handle transfer of to the receiver
            erc20Token.transferFrom(msg.sender, _to, _amount);

            (bool success,) = _to.call{value: msg.value}("");
            require(success, "Failed to send Ether");

            creatorList[_index].donationsReceived += _amount;
            
            // record creator balance on the contract
            address creatorAddress = creatorList[_index].walletAddress;
            creatorBalance[creatorAddress] += _amount;


            // increment the supporter if he has not already supported
            if(msg.sender != creatorList[_index].walletAddress){
                creatorList[_index].supporters +=1;
            }

            // Add the support to storage!
            supporters.push(Supporter(
                msg.sender,
                block.timestamp,
                _message
            ));

            // Emit a Supporter event with details about the support.
            emit SupporterEvent(
                msg.sender,
                block.timestamp,
                _message
            );
        }

     /**
     * @dev fetches all stored supporters
     */
    function getSupporters() public view returns (uint256) {
        return supporters.length;
    }

    // Get supporter info
     function getSupportInfo(uint index) public view returns (address _from, uint256 _timestamp, string memory _message){
        Supporter storage supporterDetail  = supporters[index];
        return (supporterDetail.from, supporterDetail.timestamp, supporterDetail.message);
    }
    
    // Return the entire list of creators
    function getSupporterList() public view returns (Supporter[] memory) {
        return supporters;
    }

    // get a single supporter by id
     function getSupporterObj(uint _index) public view returns (Supporter memory) {
         return supporters[_index];
    }

    // function to get creator balance
    function getCreatorBal (uint index) public view returns (uint){
        CreatorInfo storage creatorDetail = creatorList[index];
        uint creatorBal = creatorDetail.donationsReceived;
        return creatorBal;
    }

    // This will be called on the perform upkeep using the chainlink automation
    function sendContractBalanceToOwner() nonReentrant public  {
        uint256 _contractBal = address(this).balance;
        if(_contractBal > 0){
             // // send input ether amount to creator
        // Note that "receipient" is declared as payable
        (bool success, ) = _owner.call{value: _contractBal}("");
        require(success, "Failed to send Ether"); 
        }
    }

    // perfom automation once a creator achieve a certain milestone



    //  function to withdraw all ether from the contract
    function contractOwnerWithdraw() nonReentrant public {
        uint amount = address(this).balance;
        
        // send all ether to owner
        (bool success, ) = _owner.call{value : amount}("");
        require(success, "Failed to send ether");
    }

    // Automatically display the verify batch once a user receive their first donation using chainLink automation
    function addVerifyBatch() public {
        for(uint256 i = 0; i < creatorList.length; i++){
            CreatorInfo storage creatorDetail = creatorList[i];
            if(creatorDetail.donationsReceived > 0)
            creatorDetail.verified = true;
        }
    }

    // Using chainlink VRF randomly select 3 featured creators every 5 minutes
    function featuredCreator() public returns (CreatorInfo[] memory creators){
       uint256 requestId = requestRandomWords();
        uint256 winnerIndex = randomWordsNum % creatorList.length;
        CreatorInfo storage _featuredCreator  = creatorList[winnerIndex];
        featuredList.push(_featuredCreator);
        return featuredList;
    }

    // function to get contract balance
    function contractBal() public view returns(uint){
       return address(this).balance;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory  /* performData */)
    {

    // Check if any creator has received donations
    for (uint256 i = 0; i < getCreatorList().length; i++) {
        CreatorInfo storage creatorDetail = creatorList[i];

        if (creatorDetail.donationsReceived > 0) {
            upkeepNeeded = true; // Upkeep is needed if any creator has received donations
            break; // Exit the loop as soon as a qualifying creator is found
        }
    }

    // Additional check: Perform upkeep every 5 minutes
    if((block.timestamp - lastTimeStamp) > interval){
        upkeepNeeded = true;
    }

    // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {

        addVerifyBatch();

        // call the requestRandom function every 5 minutes update later to every 7 days
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            requestRandomWords();
        }
        // We don't use the performData in this example. The performData is generated by the Automation Node's call to your checkUpkeep function
    } 

    

     // Assumes the subscription is funded sufficiently.
    function requestRandomWords()
        public 
        onlyOwner
        returns (uint256 requestId)
    {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        // randomWordsNum = _randomWords[0]; // Set array-index to variable, easier to play with
        
         // Select 3 random creators and add them to the featured list
        selectRandomCreators(3, _randomWords);


        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function selectRandomCreators(uint256 count, uint256[] memory _randomWords) internal {
    require(count <= creatorList.length, "Count exceeds total creators");

    uint256 remainingCount = count;
    uint256 currentIndex = creatorList.length;

    while (remainingCount > 0) {
        currentIndex = currentIndex - 1;
        uint256 randomIndex = _randomWords[currentIndex % _randomWords.length] % currentIndex;  // Adjusted here
        swapCreators(currentIndex, randomIndex);
        featuredList.push(creatorList[currentIndex]);
        remainingCount = remainingCount - 1;
    }
}

    function swapCreators(uint256 index1, uint256 index2) internal {
       CreatorInfo storage _creator = creatorList[index1];
        creatorList[index1] = creatorList[index2];
        creatorList[index2] = _creator;
    }
    
}