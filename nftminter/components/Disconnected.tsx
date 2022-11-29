import { FC, MouseEventHandler, useCallback } from "react"
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"

const Disconnected: FC = () => {

    const modalState = useWalletModal()
    const { wallet, connect } = useWallet()

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        (event) => {
            if (event.defaultPrevented) {
                return
            }

            if (!wallet) {
                modalState.setVisible(true)
            } else {
                connect().catch(() => {})
            }
        },[wallet, connect, modalState]
    )

  return (
    <Container>
      <VStack spacing={20}>
        
        <Heading
          color="white"
          as="h1"
          size="4xl"
          noOfLines={0}
          textAlign="center"
        >
          Mint your city. Join AIC DAO. Level up.
        </Heading>
        <Button
          bgColor="accent"
          color="white"
          width={450}
          height={75}
          onClick={handleClick}
        >
          <HStack>
            <Text  as="b" fontSize="xl">become a resident </Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </VStack>
    </Container>
  )
}

export default Disconnected