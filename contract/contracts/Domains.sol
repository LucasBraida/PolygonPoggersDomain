// SPDX-License-Identifier: UNLICENSED
/*TODO
- add Ownable openzeppelin
- setPrice only owner
- getPrice
- add registerWithRecord
- add checkdomainAvailability
- alter NFT record information to be stat??
- decide maximum length for domain and record*/
pragma solidity ^0.8.10;
import {StringUtils} from "./libraries/StringUtils.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Domains is ERC721URIStorage, Ownable {
    //Erros
    error Unauthorized();
    error AlreadyRegistered();
    error InvalidName(string name);
    error NotMininumPriceValue();

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public tld;
    uint256 public price;

    string svgPartOne =
        '<svg xmlns="http://www.w3.org/2000/svg" width="350" height="320" fill="none"><defs><linearGradient id="a" x1=".32" y1=".03" x2=".68" y2=".97"><stop offset="0%" stop-color="#3182ce"/><stop offset="14.29%" stop-color="#367fea"/><stop offset="28.57%" stop-color="#617aef"/><stop offset="42.86%" stop-color="#7f75ef"/><stop offset="57.14%" stop-color="#9670ef"/><stop offset="71.43%" stop-color="#a96bee"/><stop offset="100%" stop-color="#cb5eee"/></linearGradient></defs><rect fill="url(#a)" height="100%" width="100%"/><defs><filter id="b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="320" width="350"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949a4.382 4.382 0 0 0-4.394 0l-10.081 6.032-6.85 3.934-10.081 6.032a4.382 4.382 0 0 1-4.394 0l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616 4.54 4.54 0 0 1-.608-2.187v-9.31a4.27 4.27 0 0 1 .572-2.208 4.25 4.25 0 0 1 1.625-1.595l7.884-4.59a4.382 4.382 0 0 1 4.394 0l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616 4.54 4.54 0 0 1 .608 2.187v6.032l6.85-4.065v-6.032a4.27 4.27 0 0 0-.572-2.208 4.25 4.25 0 0 0-1.625-1.595L41.456 24.59a4.382 4.382 0 0 0-4.394 0l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595 4.273 4.273 0 0 0-.572 2.208v17.441a4.27 4.27 0 0 0 .572 2.208 4.25 4.25 0 0 0 1.625 1.595l14.864 8.655a4.382 4.382 0 0 0 4.394 0l10.081-5.901 6.85-4.065 10.081-5.901a4.382 4.382 0 0 1 4.394 0l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616 4.54 4.54 0 0 1 .608 2.187v9.311a4.27 4.27 0 0 1-.572 2.208 4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721a4.382 4.382 0 0 1-4.394 0l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616 4.53 4.53 0 0 1-.608-2.187v-6.032l-6.85 4.065v6.032a4.27 4.27 0 0 0 .572 2.208 4.25 4.25 0 0 0 1.625 1.595l14.864 8.655a4.382 4.382 0 0 0 4.394 0l14.864-8.655a4.545 4.545 0 0 0 2.198-3.803V55.538a4.27 4.27 0 0 0-.572-2.208 4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><text x="30" y="270" font-size="22" fill="#fff" filter="url(#b)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = "</text></svg>";

    mapping(string => address) public domains;
    mapping(string => string) public records;
    mapping(string => uint256) public domainToTokenURI;
    mapping(uint256 => string) public tokenURIToDomain;

    constructor(string memory _tld, uint256 _price)
        payable
        ERC721("Polygon Domain Service Test", "PDST")
    {
        tld = _tld;
        price = _price;
    }

    function generateURIJson(string memory name, string memory _record)
        internal
        view
        returns (string memory)
    {
        // Combine the name passed into the function  with the TLD
        string memory _name = string(abi.encodePacked(name, ".", tld));
        // Create the SVG (image) for the NFT with the name
        string memory finalSvg = string(
            abi.encodePacked(svgPartOne, _name, svgPartTwo)
        );
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                _name,
                '", "description": "A domain on the Polygon Poggers name service", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSvg)),
                '","attributes": [{"trait_type": "Record", "value": "',
                _record,
                '"}]}'
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return finalTokenUri;
    }

    function generateURIJson(string memory name)
        internal
        view
        returns (string memory)
    {
        // Combine the name passed into the function  with the TLD
        string memory _name = string(abi.encodePacked(name, ".", tld));
        // Create the SVG (image) for the NFT with the name
        string memory finalSvg = string(
            abi.encodePacked(svgPartOne, _name, svgPartTwo)
        );
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                _name,
                '", "description": "A domain on the Showcrivel name service", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSvg)),
                '","attributes": [{"trait_type": "Record", "value": "No record set"}]}'
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return finalTokenUri;
    }

    function validDomainSize(string calldata name) public pure returns (bool) {
        return StringUtils.strlen(name) <= 10 && StringUtils.strlen(name) > 0;
    }

    // A register function that adds their names to our mapping
    function register(string calldata name) public payable {
        //require(domains[name] == address(0));
        if(domains[name] != address(0)) revert AlreadyRegistered();
        //require(msg.value >= price, "Not enough Matic paid");
        if(msg.value < price) revert NotMininumPriceValue();
        if(!validDomainSize(name)) revert InvalidName(name);
        uint256 newRecordId = _tokenIds.current();

        // // Combine the name passed into the function  with the TLD
        // string memory _name = string(abi.encodePacked(name, ".", tld));
        // // Create the SVG (image) for the NFT with the name
        // string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));

        // // Create the JSON metadata of our NFT. We do this by combining strings and encoding as base64
        // string memory json = Base64.encode(
        //   abi.encodePacked(
        //     '{"name": "',
        //     _name,
        //     '", "description": "A domain on the Showcrivel name service", "image": "data:image/svg+xml;base64,',
        //     Base64.encode(bytes(finalSvg)),
        //     '","record": ""}'
        //   )
        // );

        // string memory finalTokenUri = string( abi.encodePacked("data:application/json;base64,", json));
        string memory finalTokenUri = generateURIJson(name);

        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, finalTokenUri);
        domains[name] = msg.sender;
        domainToTokenURI[name] = newRecordId;
        tokenURIToDomain[newRecordId] = name;

        _tokenIds.increment();
    }

    // This will give us the domain owners' address
    function getAddress(string memory name) public view returns (address) {
        return domains[name];
    }

    function setRecord(string memory name, string memory record) public {
        // Check that the owner is the transaction sender
        //require(domains[name] == msg.sender, "Not domain owner");
        if(domains[name] != msg.sender) revert Unauthorized();
        uint256 tokenId = domainToTokenURI[name];
        records[name] = record;
        string memory updatedTokenURI = generateURIJson(name, record);
        _setTokenURI(tokenId, updatedTokenURI);
    }

    function getRecord(string memory name) public view returns (string memory) {
        return records[name];
    }

    function getAllNames() public view returns (string[] memory) {
        string[] memory allNames = new string[](_tokenIds.current());
        for (uint256 i = 0; i < _tokenIds.current(); i++) {
            allNames[i] = tokenURIToDomain[i];
        }

        return allNames;
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to withdraw Matic");
    }
}
