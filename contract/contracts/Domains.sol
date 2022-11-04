// SPDX-License-Identifier: MIT
/*TODO
- add tests to everything
- add update information when an NFT is traded on another plataform, like opensea
    update domains mapping
- add a fee for the trade
*/
pragma solidity ^0.8.10;
import {StringUtils} from "./libraries/StringUtils.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PolygonPoggersDomains is ERC721URIStorage, Ownable {
    //Errors
    error Unauthorized();
    error AlreadyRegistered();
    error InvalidName(string name);
    error InvalidRecordSize();
    error NotMininumPriceValue();

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public tld;
    uint public price;
    uint public domainMaxSize;
    uint public recordMaxSize;

    string svgPartOne =
        '<svg xmlns="http://www.w3.org/2000/svg" width="350" height="320" fill="none"><defs><linearGradient id="a" x1=".32" y1=".03" x2=".68" y2=".97"><stop offset="0%" stop-color="#3182ce"/><stop offset="14.29%" stop-color="#367fea"/><stop offset="28.57%" stop-color="#617aef"/><stop offset="42.86%" stop-color="#7f75ef"/><stop offset="57.14%" stop-color="#9670ef"/><stop offset="71.43%" stop-color="#a96bee"/><stop offset="100%" stop-color="#cb5eee"/></linearGradient></defs><rect fill="url(#a)" height="100%" width="100%"/><defs><filter id="b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="320" width="350"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949a4.382 4.382 0 0 0-4.394 0l-10.081 6.032-6.85 3.934-10.081 6.032a4.382 4.382 0 0 1-4.394 0l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616 4.54 4.54 0 0 1-.608-2.187v-9.31a4.27 4.27 0 0 1 .572-2.208 4.25 4.25 0 0 1 1.625-1.595l7.884-4.59a4.382 4.382 0 0 1 4.394 0l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616 4.54 4.54 0 0 1 .608 2.187v6.032l6.85-4.065v-6.032a4.27 4.27 0 0 0-.572-2.208 4.25 4.25 0 0 0-1.625-1.595L41.456 24.59a4.382 4.382 0 0 0-4.394 0l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595 4.273 4.273 0 0 0-.572 2.208v17.441a4.27 4.27 0 0 0 .572 2.208 4.25 4.25 0 0 0 1.625 1.595l14.864 8.655a4.382 4.382 0 0 0 4.394 0l10.081-5.901 6.85-4.065 10.081-5.901a4.382 4.382 0 0 1 4.394 0l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616 4.54 4.54 0 0 1 .608 2.187v9.311a4.27 4.27 0 0 1-.572 2.208 4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721a4.382 4.382 0 0 1-4.394 0l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616 4.53 4.53 0 0 1-.608-2.187v-6.032l-6.85 4.065v6.032a4.27 4.27 0 0 0 .572 2.208 4.25 4.25 0 0 0 1.625 1.595l14.864 8.655a4.382 4.382 0 0 0 4.394 0l14.864-8.655a4.545 4.545 0 0 0 2.198-3.803V55.538a4.27 4.27 0 0 0-.572-2.208 4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><text x="30" y="270" font-size="22" fill="#fff" filter="url(#b)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = "</text></svg>";

    struct Domain{
        string name;
        string record;
        address owner;
    }
    //Domain to owner
    mapping(string => address) public domains;
    mapping(string => string) public records;
    mapping(string => uint) public domainToTokenID;
    mapping(uint => string) public tokenIDToDomain;

    constructor(string memory _tld, uint _price, uint _domainMaxSize, uint _recordMaxSize)
        payable
        ERC721("Polygon Domain Service Test", "PDST")
    {
        tld = _tld;
        price = _price;
        domainMaxSize = _domainMaxSize;
        recordMaxSize = _recordMaxSize;
    }
    function BTS(string memory _text) public pure returns (string memory) {
        uint len;
        uint i = 0;
        uint bytelength = bytes(_text).length;
        bytes memory nb;
        bytes1 b;
        // nb = bytes.concat(nb, bytes(_text)[0]);
        // nb = bytes.concat(nb, bytes(_text)[1]);
        for(i = 0; i < bytelength; i++) {
            // b = bytes(_text)[i];
            if(bytes(_text)[i] != 0x20) {
                nb = bytes.concat(nb, bytes(_text)[i]);
            }
        }
        return string(nb);
    }
    /// @dev setPrice() sets domain price.
    /// @param _price - new domain price
    function setPrice(uint _price) public onlyOwner {
        price = _price;
    }
    /// @dev setDomainMaxSize() sets domain maximum size in charaters
    /// @param _domainMaxSize - new domain size
    function setDomainMaxSize(uint _domainMaxSize) public onlyOwner{
        domainMaxSize = _domainMaxSize;
    }
    /// @dev setRecordMaxSize() sets record maximum size in charaters
    /// @param _recordMaxSize - new record size
    function setRecordMaxSize(uint _recordMaxSize) public onlyOwner{
        recordMaxSize = _recordMaxSize;
    }
    /// @dev generateURIJson() creates the new ToKen URI string with name and record
    /// @param _name - domain name
    /// @param _record - record
    /// @return Return the token URI
    function generateURIJson(string memory _name, string memory _record)
        internal
        view
        returns (string memory){
        // Combine the name passed into the function  with the TLD
        string memory name = string(abi.encodePacked(_name, ".", tld));
        // Create the SVG (image) for the NFT with the name
        string memory finalSvg = string(
            abi.encodePacked(svgPartOne, name, svgPartTwo)
        );
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                name,
                '", "description": "A domain on the Polygon Poggers name service", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSvg)),
                '","record": "',_record,'","attributes": [{"trait_type": "Record", "value": "',
                _record,
                '"}]}'
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return finalTokenUri;
    }
    /// @dev generateURIJson() creates the new ToKen URI string with name and without record
    /// @param _name - domain name
    /// @return Return the token URI
    function generateURIJson(string memory _name)
        internal
        view
        returns (string memory){
        // Combine the name passed into the function  with the TLD
        string memory name = string(abi.encodePacked(_name, ".", tld));
        // Create the SVG (image) for the NFT with the name
        string memory finalSvg = string(
            abi.encodePacked(svgPartOne, name, svgPartTwo)
        );
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                name,
                '", "description": "A domain on the Showcrivel name service", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSvg)),
                '","record": "No record set","attributes": [{"trait_type": "Record", "value": "No record set"}]}'
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return finalTokenUri;
    }
    /// @dev validDomainSize() checks if the name has a valid domain size
    /// @param _name - domain name
    /// @return Returns true if valid size
    function validDomainSize(string memory _name) public view returns (bool) {
        return StringUtils.strlen(_name) <= domainMaxSize && StringUtils.strlen(_name) > 0;
    }
    /// @dev validDomainSize() checks if the record has a valid size
    /// @param _record - domain record
    /// @return Returns true if valid size
    function validRecordSize(string memory _record) public view returns (bool) {
        return StringUtils.strlen(_record) <= recordMaxSize && StringUtils.strlen(_record) > 0;
    }
    /// @dev checkDomainAvailability() checks if the domain is already in use
    /// @param _name - domain name
    /// @return Returns true if it's not in use
    function checkDomainAvailability(string memory _name) public view returns (bool){
        return !(domains[_name] != address(0));
    }

    /// @dev register() mints a new domain
    /// @param _name - domain name
    function register(string memory _name) public payable {
        if(domains[_name] != address(0)) revert AlreadyRegistered();
        if(msg.value < price) revert NotMininumPriceValue();
        if(!validDomainSize(_name)) revert InvalidName(_name);
        uint newRecordId = _tokenIds.current();
        string memory finalTokenUri = generateURIJson(_name);

        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, finalTokenUri);
        domains[_name] = msg.sender;
        domainToTokenID[_name] = newRecordId;
        tokenIDToDomain[newRecordId] = _name;

        _tokenIds.increment();
    }
    /// @dev registerWithRecord() mints a new domain with record
    /// @param _name - domain name
    /// @param _record - doamin record
    function registerWithRecord(string memory _name, string memory _record) public payable {
        if(domains[_name] != address(0)) revert AlreadyRegistered();
        if(msg.value < price) revert NotMininumPriceValue();
        if(!validDomainSize(_name)) revert InvalidName(_name);
        if(!validRecordSize(_record)) revert InvalidRecordSize();
        uint newRecordId = _tokenIds.current();
        string memory finalTokenUri = generateURIJson(_name, _record);

        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, finalTokenUri);
        domains[_name] = msg.sender;
        records[_name] = _record;
        domainToTokenID[_name] = newRecordId;
        tokenIDToDomain[newRecordId] = _name;

        _tokenIds.increment();
    }

    /// @dev getAddress() get domains's owner
    /// @param _name - domain name
    /// @return Returns owner's address
    function getAddress(string memory _name) public view returns (address) {
        return domains[_name];
    }
    /// @dev setRecord() sets or alters a domain's record. Only domain's owner can perform a change.
    /// @param _name - domain name
    /// @param _record - new record
    function setRecord(string memory _name, string memory _record) public {
        // Check that the owner is the transaction sender
        if(domains[_name] != msg.sender) revert Unauthorized();
        if(!validRecordSize(_record)) revert InvalidRecordSize();
        uint tokenId = domainToTokenID[_name];
        records[_name] = _record;
        string memory updatedTokenURI = generateURIJson(_name, _record);
        _setTokenURI(tokenId, updatedTokenURI);
    }
    /// @dev getRecord() get record for domain name
    /// @param _name - domain name
    /// @return - Returns domain record
    function getRecord(string memory _name) public view returns (string memory) {
        return records[_name];
    }
    /// @dev getAllNames() get all domain names and their respective records and owners
    /// @return - Returns an array of Domains
    function getAllNames() public view returns (Domain [] memory) {
        Domain[] memory allNames = new Domain[](_tokenIds.current());
        for (uint i = 0; i < _tokenIds.current(); i++) {
            string memory _name = tokenIDToDomain[i];
            string memory _record = records[_name];
            address _owner = domains[_name];
            Domain memory _domain = Domain(_name, _record, _owner);
            allNames[i] = _domain;
        }

        return allNames;
    }

    /// @dev withdraw() get all funds
    function withdraw() public onlyOwner {
        uint amount = address(this).balance;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to withdraw Matic");
    }
}
