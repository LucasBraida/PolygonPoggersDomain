// SPDX-License-Identifier: MIT

pragma solidity >=0.8.10;

library EmptySpaceChecker {
    /**
     * @dev Returns a string without empty spaces
     *
     * @param _text The string to remove empty spaces
     * @return Return the fixed string
     */
    function remove(string memory _text) internal pure returns (string memory ) {
        uint i = 0;
        uint bytelength = bytes(_text).length;
        bytes memory bytesArray;
        //turn the string into bytes array and check each byte
        for(i = 0; i < bytelength; i++) {
            // remove the empty space byte
            if(bytes(_text)[i] != 0x20) {
                bytesArray = bytes.concat(bytesArray, bytes(_text)[i]);
            }
        }
        // turn bytes array back to string
        return string(bytesArray);
    }
    /**
     * @dev Returns true if a string contains empty spaces
     *
     * @param _text The string to check empty spaces
     * @return Returns if there are empty spaces
     */
    function check(string memory _text) internal pure returns (bool) {
        uint i = 0;
        uint bytelength = bytes(_text).length;
        //turn the string into bytes array and check each byte
        for(i = 0; i < bytelength; i++) {
            // returns true if an empty space is found
            if(bytes(_text)[i] == 0x20) {
                return true;
            }
        }
        // return true otherwise
        return false;
    }
}