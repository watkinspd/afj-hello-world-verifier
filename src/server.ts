import express from 'express'
import {
    ConnectionEventTypes,
    ConnectionStateChangedEvent,
    DidExchangeState,
    Agent,
    InitConfig,
    ProofAttributeInfo,
    ProofEventTypes,
    ProofStateChangedEvent,
    AttributeFilter,
    HttpOutboundTransport,
    ConsoleLogger,
    LogLevel,
    AutoAcceptProof
} from '@aries-framework/core'
import { HttpInboundTransport, agentDependencies } from '@aries-framework/node'
var qrc = require ('qrcode')

const app = express()

const serviceEndpoint = 'faber-pdub.ngrok.io'   //needs to match your ngrok session
const serviceEndpointPort = 8020                // needs to match your ngrok session
const walletLabel = 'afj-hellow-world-verifier'
const walletKey = 'notagreatkey00000000000000000000'
const listenPort = 3000
const ledgerID = 'CANdyDev'
const CANdyDev = `{"reqSignature":{},"txn":{"data":{"data":{"alias":"dev-bc-1","blskey":"14YvF9m4TU4FSkqZQ9gDRr9Ef95aHPuieToEPTmMNEWAqkKB75FfGM3rU25Sfhqkd8nmGMjaJDso9jWgoQdaPqQxscuxu7VcDBmkByiZWtVohk4mRxSownozaaYESpyte4A346wXfGcqxCvUUa9gSyU1qEaM6ss4Z3e5pc39hzdekAq","blskey_pop":"RXmiB6JYFKU6RJwdhfwsH9mGSJx4X8s2Dsk3gHn7Ytajsn6kuaBC6FFiRmzbKkDuYFnMzF81JuRKHC7NBrKgsh8egmyGm5APNya6W6G7XyWwGs2WHX5tUtHeBVogSQEjV8Yq4RfzbpM6TJzPDzu8HyM1Why2nX9f84DMxgxJPMJseo","client_ip":"3.99.10.96","client_port":"9702","node_ip":"3.98.254.147","node_port":"9701","services":["VALIDATOR"]},"dest":"FgRxLSbzVzcMC8ioAbzbzYi1oqhYLUsoFeDewYiw97U"},"metadata":{"from":"7iLf2c7weDopmBLyPPGLHz"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"26ac1e1cd83aa136090321bc58877f8563d1ed14cf11e78e1eb46a33692580f1"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"dev-qc-1","blskey":"NFLKzusQk9RfCAvmw5z56eFXVDhQahAwd8KoxNU4kaikT9RTUBTx537oswApMmTwFhcsrfTpwUm49QLHcVMNY4oZMyoq1ok1jZnUKvkPjqFkYahCr8VefsknaUj6qWiqoqFB1hLCdP3jeXvZbDVQSBnjTSysUkgnVwXEXdmAjt2ovn","blskey_pop":"QtrKM3pBvf9UnNgihnpoC86kVSm1VkLSj6maz9FGupZXcYcsjPaU8fbibUboW6NwzT9WfKpwCTmebDfPC6dieNZpgwxee8WDXHF7nBsgH8ctY2P3aezsEDs2zYSiCvrbdFkxBKvjNMkesK3xKUwGVUMyggjGckVFG2zZgUQ8pY4LKy","client_ip":"3.96.89.59","client_port":"9702","node_ip":"3.97.25.250","node_port":"9701","services":["VALIDATOR"]},"dest":"CfTG6ZPJzXRu9xozL43jzsA8EQXRvkbDHvYw3QzuTQrf"},"metadata":{"from":"XdVFchbXSMC898NjWCymXD"},"type":"0"},"txnMetadata":{"seqNo":2,"txnId":"8a6f8e43b9d9f7020c824e069a521b6682a91d48b3dd31bd71b67caaaf7ada9c"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"CandyDevOntNode01","blskey":"2Ldaj4ZeYmri7sx9YVGk5x1DRD5NMwbuASQPvEicqC7yQxreCvZYKKrnfi2kiTm26Mss5dm6UUeVFYLPKFwHqXWUnACyMNnHAUBw2HissHNXtLWUVXmPSdAXNgjYVTpPDZ4FuHKWuyDKtghfcb7F6UZSiJwkbVytA4aWoQmFeVrsHSp","blskey_pop":"RGkwsaPoSrERaFTbkLx5CQ8EcthFrNU8LaXsVV4dage4Cqk6eFtqeUj6BRzUaGUAQMFWiRTmfand6AhAt9ghBK6Hi2axf93JEkDChgPUC1Nks9HscMYRxs2AFuXiectW1uHEFW4QtrtWuKyfmBSfyv9rDvJiKCZsiVWaQpecUftdeP","client_ip":"20.200.95.22","client_port":"9702","node_ip":"20.151.226.136","node_port":"9701","services":["VALIDATOR"]},"dest":"DcvgAW7Wuw2aDxakjJGxFnssaXoAgUEWBhRUfNoEeVHx"},"metadata":{"from":"SmQ4y56g72C3ESKVgJTsBL"},"type":"0"},"txnMetadata":{"seqNo":3,"txnId":"3e0f572aa2a2e1c4ebf2ba679438f30f73abce817f3b6af1308c6fcb52823594"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"CandyDevOntNode02","blskey":"y9Vim7vZ39VkaacrmTcpQ8ytniabf2NSq3RRNAmELx8U93nKN1XhQaAhLJWPBwAjDtWfTP9PeaJUJZ1JNx1b3vmroZzEiPigMViZGBgnSLSiPnNyGCo1WqmSV2XD5QVqFLoRkym7C97vg9p5xTZm2EmBfdDpEc3M5F2tqofDhzFAzi","blskey_pop":"RQrbDZ1uj6QwUqGwzN2LMNw4DvpNmpgsZEYWYVM7e3aWnyiVWijgTV6mp1rjJR83x48P7dN2JYXFer8iTym9iiKvKTKKEMGEGvEUkGE3r3Mxg6hGMKEFkr5aYZMpoqiZ5BWjN52pGjMx2SfEr7FcmcHrwFw8znQvNxn8s1qh9TLCJ3","client_ip":"20.200.77.108","client_port":"9702","node_ip":"20.104.69.119","node_port":"9701","services":["VALIDATOR"]},"dest":"6Ey8JA9YDPzEccbi4dGTaEoPtWK6bvVki6WveWHMUjHb"},"metadata":{"from":"5KwZGBgmVhjAUmc3Ur8wGZ"},"type":"0"},"txnMetadata":{"seqNo":4,"txnId":"5fcd2367ffe5f0f2e63c5807692b0895f3d9db8c10a35a1974f9f507a3f291e3"},"ver":"1"}`

const ledgerGenesis = CANdyDev

const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary')

class AFJAgent {
    agent:  Agent
    endpoint: string
    inPort: number
    connection_id: string
}

class AFJService {

    setupConnectionListener = (afj_agent: AFJAgent) => {
        afj_agent.agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
          if (payload.connectionRecord.state === DidExchangeState.Completed) {
            console.log("Connection completed", payload.connectionRecord)
            afj_agent.connection_id=payload.connectionRecord.id
            this.requestProof(afj_agent)
          }
          else {
            console.log("Connection status", payload.connectionRecord)
          }
        })
    }

    setupProofRequestListener = (afj_agent: AFJAgent) => {
        console.log("Listen for proof")
        afj_agent.agent.events.on(ProofEventTypes.ProofStateChanged, async ({ payload }: ProofStateChangedEvent) => {
            console.log("Proof presentation=", JSON.stringify(payload.proofRecord))
            console.log("Proof state: ", payload.proofRecord?.state)
            console.log("Proof verified: ", payload.proofRecord?.isVerified ? 'Verified':'not Verified')

            if (payload.proofRecord?.isVerified) {
                const proofData = JSON.parse(decode(payload.proofRecord.presentationMessage.presentationAttachments[0].data.base64))
                console.log("attr_1=", JSON.stringify(proofData.requested_proof.revealed_attrs.attr_1.raw))
                console.log("attr_2=", JSON.stringify(proofData.requested_proof.revealed_attrs.attr_2.raw))
                console.log("attr_3=", JSON.stringify(proofData.requested_proof.revealed_attrs.attr_3.raw))
            }
        })
    }

    async listenConnections(AFJAgent: AFJAgent): Promise<Boolean> {
        var connected = false
        this.setupConnectionListener(AFJAgent)
        return connected
    }

    async listenProofs(AFJAgent: AFJAgent): Promise<Boolean> {
        var connected = false
        this.setupProofRequestListener(AFJAgent)
        return connected
    }

    async requestProof(AFJAgent: AFJAgent): Promise<String> {
        const connectionRecord = AFJAgent.connection_id

        const attributes:Record<string, ProofAttributeInfo> = {}

        attributes['attr_1'] = new ProofAttributeInfo({
          name: "given_names",
          restrictions: [ new AttributeFilter({
                            schemaName: "unverified_person",
                            schemaVersion: "0.1.0",
                            issuerDid: "9wVuYYDEDtpZ6CYMqSiWop"})
                        ]
            })

        attributes['attr_2'] = new ProofAttributeInfo({
            name: "family_name",
            restrictions: [ new AttributeFilter({
                            schemaName: "unverified_person",
                            schemaVersion: "0.1.0",
                            issuerDid: "9wVuYYDEDtpZ6CYMqSiWop"})
                        ]
            })

        attributes['attr_3'] = new ProofAttributeInfo({
            name: "region",
            restrictions: [ new AttributeFilter({
                                schemaName: "unverified_person",
                                schemaVersion: "0.1.0",
                                issuerDid: "9wVuYYDEDtpZ6CYMqSiWop"})
                            ]
            })

        console.log("Requesting Proof:", connectionRecord, attributes['attr_1'])
        await AFJAgent.agent.proofs.requestProof(AFJAgent.connection_id, {
            requestedAttributes: attributes
            })
        var result = "ProofRequested"
        return result
    }

    async createInvitation(AFJAgent: AFJAgent): Promise<String> {
        var connectRecord = await AFJAgent.agent.oob.createLegacyInvitation()
//        var connectRecord = await AFJAgent.agent.oob.createInvitation()
        var invite = {
            invitationUrl: connectRecord.invitation.toUrl({ domain: 'https://'+AFJAgent.endpoint}),
//            invitationUrl: connectRecord.outOfBandInvitation.toUrl({ domain: 'https://'+AFJAgent.endpoint}),
            connectRecord
        }
        console.log("invitation", invite.invitationUrl)
        return invite.invitationUrl
    }

    async initializeAgent(AFJAgent: AFJAgent): Promise<String> {
        const config: InitConfig = {
            label: walletLabel,
            logger: new ConsoleLogger(LogLevel.info),
            walletConfig: {
                id: walletLabel,
                key: walletKey,
            },
            indyLedgers: [
              {
                genesisTransactions: ledgerGenesis,
                id: ledgerID,
                isProduction: false,
              },
            ],
            autoAcceptConnections: true,
            autoAcceptProofs: AutoAcceptProof.ContentApproved,
            connectToIndyLedgersOnStartup: true,
            endpoints: ['https://'+serviceEndpoint]
        }

        const agent = new Agent(config, agentDependencies)

        agent.registerOutboundTransport(new HttpOutboundTransport())
        agent.registerInboundTransport(new HttpInboundTransport({ port: serviceEndpointPort }))

        const initialize = async () => await agent.initialize().catch(console.error)

        await agent.initialize()

        AFJAgent.agent = agent
        AFJAgent.inPort = serviceEndpointPort
        AFJAgent.endpoint = serviceEndpoint
        console.log("New agent created")

        this.setupConnectionListener(AFJAgent)
        this.setupProofRequestListener(AFJAgent)

        var result = "Agent and app initialized"
        return result
    }
}

const AgentAFJ = new AFJAgent()
const ServiceAFJ = new AFJService()
const result = ServiceAFJ.initializeAgent(AgentAFJ)

app.get('/', async (req, res) => {
    return res.json({ message: 'AFJ Hellow World Verifier Demo',
                      connectInviteQR: '/connection/invitation/qrcode',
                      connectInviteBCWallet: '/connection/invitation/bcwallet',
                      requestProof: '/proof/request' })
})

app.get('/connection/invitation/qrcode', async (req, res ) => {
    const result = await ServiceAFJ.createInvitation(AgentAFJ)
    var inviteQR = ''
    qrc.toString(result.toString(), {type:'terminal', 'small': true, 'scale': 1}, function (err: any, url: string) {
        if (err) console.log('qr error')
        console.log(url)
     })

    qrc.toString(result.toString(), {type:'svg'}, function (err: any, url: string) {
        if (err) console.log('qr error')
        inviteQR = url.replace('viewBox=', 'width="600" height="600" viewBox=')
    })

    res.setHeader('Content-Type', 'text/html')
    return res.send('<body>'+inviteQR+'</body>')
})

app.get('/connection/invitation/bcwallet', async (req, res ) => {
    const result = await ServiceAFJ.createInvitation(AgentAFJ)

    qrc.toString(result.toString(), {type:'terminal', 'small': true, 'scale': 1}, function (err: any, url: string) {
        if (err) console.log('qr error')
        console.log(url)
     })

    res.setHeader('Content-Type', 'text/html')
    return res.send('<body><a href='+'"'+'bcwallet://'+result.toString()+'"'+'>Click to load into BC Wallet</a></body>')
})

app.get('/proof/request', async (req, res ) => {
    const result = await ServiceAFJ.requestProof(AgentAFJ)
    return res.json({ message: 'proofRequest'})
})

app.listen(listenPort)
