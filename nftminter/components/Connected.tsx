import {
  Button,
  Container,
  Heading,
  VStack,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react"
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  Metaplex,
  walletAdapterIdentity,
  CandyMachine,
} from "@metaplex-foundation/js"
import { useRouter } from "next/router"

const Connected: FC = () => {
  const { connection } = useConnection()
  const walletAdapter = useWallet()
  const [candyMachine, setCandyMachine] = useState<CandyMachine>()
  const [isMinting, setIsMinting] = useState(false)

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])

  useEffect(() => {
    if (!metaplex) return

    metaplex
      .candyMachines()
      .findByAddress({
        address: new PublicKey("AqfN7Cvz3ixGLUWYwDvwMtC91nHuRLZZskF6rDqHUj7K"),
      })
      .run()
      .then((candyMachine) => {
        console.log(candyMachine)
        setCandyMachine(candyMachine)
      })
      .catch((error) => {
        alert(error)
      })
  }, [metaplex])

  const router = useRouter()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (event.defaultPrevented) return

      if (!walletAdapter.connected || !candyMachine) {
        return
      }

      try {
        setIsMinting(true)
        const nft = await metaplex.candyMachines().mint({ candyMachine }).run()

        console.log(nft)
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`)
      } catch (error) {
        alert(error)
      } finally {
        setIsMinting(false)
      }
    },
    [metaplex, walletAdapter, candyMachine]
  )

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome AI CITIES.
          </Heading>
          <VStack>
            <Image width={325} height={325} src="avatar5.png" alt="" />
          </VStack>
          <Text color="white" fontSize="xl" textAlign="center">
            Each <Text as="b">CITY</Text> is randomly generated from AI and the key to <Text as="b"> AIC, </Text> AI City DAO on <Text as="b"> Realms. </Text>
          </Text>
          <Text color="white" fontSize="l" textAlign="center" as="b"> 
            DAO link: https://app.realms.today/dao/bbG3PnjjvDeWWEWY1miRgEKGqwep2FyAZNvir9YEGb9?cluster=devnet
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image width={250} height={250} src="avatar1.png" alt=""/>
        <Image width={250} height={250} src="avatar2.png" alt="" />
        <Image width={250} height={250} src="avatar3.png" alt="" />
        <Image width={250} height={250} src="avatar4.png" alt="" />
      </HStack>

      <Button
        bgColor="accent"
        color="white"
        maxW="380px"
        onClick={handleClick}
        isLoading={isMinting}
      >
          <Text>mint a city</Text>
      </Button>
    </VStack>
  )
}

export default Connected