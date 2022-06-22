import * as Cord from '@cord.network/api'
import { UUID } from '@cord.network/utils'

async function main() {
  await Cord.init({ address: 'ws://127.0.0.1:9944' })

  // Step 1: Setup Org Identity
  console.log(`\n❄️  Demo Identities (KeyRing)`)
  //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
  const entityIdentity = Cord.Identity.buildFromURI('//Bob', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🏛  Entity (${entityIdentity.signingKeyType}): ${entityIdentity.address}`
  )
  const employeeIdentity = Cord.Identity.buildFromURI('//Dave', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `🧑🏻‍💼 Employee (${employeeIdentity.signingKeyType}): ${employeeIdentity.address}`
  )
  const holderIdentity = Cord.Identity.buildFromURI('//Alice', {
    signingKeyPairType: 'sr25519',
  })
  console.log(
    `👩‍⚕️ Holder (${holderIdentity.signingKeyType}): ${holderIdentity.address}`
  )
  const verifierIdentity = Cord.Identity.buildFromURI('//Charlie', {
    signingKeyPairType: 'ed25519',
  })
  console.log(
    `🏢 Verifier (${verifierIdentity.signingKeyType}): ${verifierIdentity.address}`
  )
  console.log('✅ Identities created!')

  // Step 2: Create a new Space
  console.log(`\n❄️  Space Creation `)
  let spaceContent = {
    title: 'Demo Space',
    description: 'Space for demo',
  }
  let spaceTitle = spaceContent.title + ':' + UUID.generate()
  spaceContent.title = spaceTitle

  let newSpace = Cord.Space.fromSpaceProperties(spaceContent, employeeIdentity)

  let spaceCreationExtrinsic = await newSpace.create()

  console.dir(newSpace, { depth: null, colors: true })

  try {
    await Cord.ChainUtils.signAndSubmitTx(
      spaceCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.ChainUtils.IS_IN_BLOCK,
        rejectOn: Cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Space created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 3: Create a new Schema
  console.log(`\n❄️  Schema Creation `)
  console.log(`🔗 ${newSpace.identifier}`)
  let newSchemaContent = require('../res/schema.json')
  let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
  newSchemaContent.title = newSchemaTitle

  let newSchema = Cord.Schema.fromSchemaProperties(
    newSchemaContent,
    employeeIdentity,
    newSpace.identifier
  )

  let schemaCreationExtrinsic = await newSchema.create()

  console.dir(newSchema, { depth: null, colors: true })

  try {
    await Cord.ChainUtils.signAndSubmitTx(
      schemaCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.ChainUtils.IS_IN_BLOCK,
        rejectOn: Cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Schema created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 4: Create a new Stream
  console.log(`\n❄️  Stream Creation `)
  console.log(`🔗  ${newSpace.identifier} `)
  console.log(`🔗  ${newSchema.identifier} `)

  const content = {
    name: 'Alice',
    age: 29,
    gender: 'Female',
    country: 'India',
    credit: 1000,
  }
  let schemaStream = Cord.Content.fromProperties(
    newSchema,
    content,
    employeeIdentity.address,
    holderIdentity.address
  )
  console.dir(schemaStream, { depth: null, colors: true })

  let newStreamContent = Cord.ContentStream.fromContent(
    schemaStream,
    employeeIdentity,
    { space: newSpace.identifier }
  )
  console.dir(newStreamContent, { depth: null, colors: true })

  let newStream = Cord.Stream.fromContentStream(newStreamContent)

  let streamCreationExtrinsic = await newStream.create()
  console.dir(newStream, { depth: null, colors: true })

  try {
    await Cord.ChainUtils.signAndSubmitTx(
      streamCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.ChainUtils.IS_IN_BLOCK,
        rejectOn: Cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Stream created!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 5: Update a Stream
  console.log(`\n❄️  Update - ${newStreamContent.identifier}`)
  const updateContent = JSON.parse(JSON.stringify(newStreamContent))
  updateContent.content.contents.name = 'Alice Jackson'

  let updateStreamContent = Cord.ContentStream.updateContentProperties(
    updateContent,
    employeeIdentity
  )
  console.dir(updateStreamContent, { depth: null, colors: true })

  let updateStream = Cord.Stream.fromContentStream(updateStreamContent)
  let updateStreamCreationExtrinsic = await updateStream.update()
  console.dir(updateStream, { depth: null, colors: true })

  try {
    await Cord.ChainUtils.signAndSubmitTx(
      updateStreamCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.ChainUtils.IS_IN_BLOCK,
        rejectOn: Cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Stream updated!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }

  // Step 6: Validate a Credential
  console.log(`\n❄️  Verify - ${updateStreamContent.identifier} `)
  const stream = await Cord.Stream.query(updateStream.identifier)
  if (!stream) {
    console.log(`Stream not anchored on CORD`)
  } else {
    const credential = Cord.Credential.fromRequestAndStream(
      updateStreamContent,
      stream
    )
    const isCredentialValid = await credential.verify()
    console.log(`Is Alices's credential valid? ${isCredentialValid}`)
  }

  // Step 7: Validate a modified Credential
  // TODO: fix error handling
  // console.log(`\n❄️  Validate Credential - ${updateStream.identifier} `)
  // const chainStream = await Cord.Stream.query(updateStream.identifier)
  // if (!chainStream) {
  //   console.log(`Stream not anchored on CORD`)
  // } else {
  //   console.dir(newStreamContent, { depth: null, colors: true })
  //   const credential = Cord.Credential.fromRequestAndStream(
  //     newStreamContent,
  //     chainStream
  //   )

  //   const isCredentialValid = await credential.verify()
  //   console.log(`Is Alices's modified credential valid? ${isCredentialValid}`)
  // }

  // Step 8: Revoke a Stream
  console.log(`\n❄️  Revoke - ${updateStreamContent.identifier} `)
  let revokeStream = updateStream

  let revokeStreamCreationExtrinsic = await revokeStream.revoke(
    employeeIdentity
  )

  try {
    await Cord.ChainUtils.signAndSubmitTx(
      revokeStreamCreationExtrinsic,
      entityIdentity,
      {
        resolveOn: Cord.ChainUtils.IS_READY,
        rejectOn: Cord.ChainUtils.IS_ERROR,
      }
    )
    console.log('✅ Stream revoked!')
  } catch (e: any) {
    console.log(e.errorCode, '-', e.message)
  }
}
main()
  .then(() => console.log('\nBye! 👋 👋 👋 '))
  .finally(Cord.disconnect)

process.on('SIGINT', async () => {
  console.log('\nBye! 👋 👋 👋 \n')
  Cord.disconnect()
  process.exit(0)
})
