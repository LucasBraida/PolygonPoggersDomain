# Polygon Poggers Domain Service

This is an ENS like Domain Service. Each domain is an NFT that can be traded on any marketplace, like OpenSea. 

The contract is an ERC721 implementation with a set of helper functions to ensure a proper functioning. Each domain consists of a NFT with a unique name, a record and an image stored on the blockchain.

A library was developed to ensure that no name contains any sort of empty space. That guarantees that not only the users of the website, but any user that interacts with the contract is prevented from registering such a name.

The frontend is a clean website where the user can mint a new domain and check the domains that were already registered. The site automatically checka and updates if the user changes the used account or chain.

A great extra feature is the ability to transfer MATIC using this interface. Since Metamask recognize ENS, but it's not configurable to accept a custom domain service, the webpage comes with a simple interface to transfer coins using the name service.

The contract is deployed at **0xCD206Fe32516f26297B7304A3E6EB9a4dC57C7da** verified at **https://polygonscan.com/address/0xCD206Fe32516f26297B7304A3E6EB9a4dC57C7da#code** and available at **https://ppd.lucasbraida.com/**

# Images

![](https://raw.githubusercontent.com/LucasBraida/PolygonPoggersDomain/main/frontend/PPD_HOMEPAGE.png)
> Home page

![](https://raw.githubusercontent.com/LucasBraida/PolygonPoggersDomain/main/frontend/PPD_GALLERY.png)

> Gallery

![](https://raw.githubusercontent.com/LucasBraida/PolygonPoggersDomain/main/frontend/PPD_SENDMATIC.png)

> Send Matic


![](https://raw.githubusercontent.com/LucasBraida/PolygonPoggersDomain/main/frontend/PPD_OPENSEA.png)

> Opensea

