import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes, OctetString, BitString } from "@peculiar/asn1-schema";
import { CMSVersion, KeyEncryptionAlgorithmIdentifier, EncryptedKey } from "./types";
import { IssuerAndSerialNumber } from "./issuer_and_serial_number";
import { AlgorithmIdentifier, SubjectKeyIdentifier } from "@peculiar/asn1-x509";
import { OtherKeyAttribute } from "./recipient_info";

/**
 * ```
 * UserKeyingMaterial ::= OCTET STRING
 * ```
 */
export type UserKeyingMaterial = OctetString;

/**
 * RecipientKeyIdentifier ::= SEQUENCE {
 *  subjectKeyIdentifier SubjectKeyIdentifier,
 *  date GeneralizedTime OPTIONAL,
 *  other OtherKeyAttribute OPTIONAL }
 */
export class RecipientKeyIdentifier {

  @AsnProp({ type: SubjectKeyIdentifier })
  public subjectKeyIdentifier = new SubjectKeyIdentifier();

  @AsnProp({ type: AsnPropTypes.GeneralizedTime, optional: true })
  public date?: Date;

  @AsnProp({ type: OtherKeyAttribute, optional: true })
  public other?: OtherKeyAttribute;

  constructor(params: Partial<RecipientKeyIdentifier> = {}) {
    Object.assign(this, params);
  }
}

/**
 * KeyAgreeRecipientIdentifier ::= CHOICE {
 *  issuerAndSerialNumber IssuerAndSerialNumber,
 *  rKeyId [0] IMPLICIT RecipientKeyIdentifier }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class KeyAgreeRecipientIdentifier {

  // * Declare rKeyId before issuerAndSerialNumber, because issuerAndSerialNumber is any in schema declaration
  @AsnProp({ type: RecipientKeyIdentifier, context: 0, implicit: true })
  public rKeyId?: RecipientKeyIdentifier;

  @AsnProp({ type: IssuerAndSerialNumber })
  public issuerAndSerialNumber?: IssuerAndSerialNumber;

  constructor(params: Partial<KeyAgreeRecipientIdentifier> = {}) {
    Object.assign(this, params);
  }
}

/**
 * RecipientEncryptedKey ::= SEQUENCE {
 *  rid KeyAgreeRecipientIdentifier,
 *  encryptedKey EncryptedKey }
 */
export class RecipientEncryptedKey {

  @AsnProp({ type: KeyAgreeRecipientIdentifier })
  public rid = new KeyAgreeRecipientIdentifier();

  @AsnProp({ type: OctetString })
  public encryptedKey: EncryptedKey = new OctetString();

  constructor(params: Partial<RecipientEncryptedKey> = {}) {
    Object.assign(this, params);
  }
}

/**
 * RecipientEncryptedKeys ::= SEQUENCE OF RecipientEncryptedKey
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: RecipientEncryptedKey })
export class RecipientEncryptedKeys extends AsnArray<RecipientEncryptedKey> {

  constructor(items?: RecipientEncryptedKey[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RecipientEncryptedKeys.prototype);
  }
}

/**
 * OriginatorPublicKey ::= SEQUENCE {
 *  algorithm AlgorithmIdentifier,
 *  publicKey BIT STRING }
 */
export class OriginatorPublicKey {

  @AsnProp({ type: AlgorithmIdentifier })
  public algorithm = new AlgorithmIdentifier();

  @AsnProp({ type: BitString })
  public publicKey = new BitString();

  constructor(params: Partial<OriginatorPublicKey> = {}) {
    Object.assign(this, params);
  }
}

/**
 * OriginatorIdentifierOrKey ::= CHOICE {
 *  issuerAndSerialNumber IssuerAndSerialNumber,
 *  subjectKeyIdentifier [0] SubjectKeyIdentifier,
 *  originatorKey [1] OriginatorPublicKey }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class OriginatorIdentifierOrKey {

  // * Declare subjectKeyIdentifier before issuerAndSerialNumber, because issuerAndSerialNumber is any in schema declaration
  @AsnProp({ type: SubjectKeyIdentifier, context: 0 })
  public subjectKeyIdentifier?: SubjectKeyIdentifier;

  // * Declare originatorKey before issuerAndSerialNumber, because issuerAndSerialNumber is any in schema declaration
  @AsnProp({ type: OriginatorPublicKey, context: 1 })
  public originatorKey?: OriginatorPublicKey;

  @AsnProp({ type: IssuerAndSerialNumber })
  public issuerAndSerialNumber?: IssuerAndSerialNumber;

  constructor(params: Partial<OriginatorIdentifierOrKey> = {}) {
    Object.assign(this, params);
  }
}

/**
 * KeyAgreeRecipientInfo ::= SEQUENCE {
 *  version CMSVersion,  -- always set to 3
 *  originator [0] EXPLICIT OriginatorIdentifierOrKey,
 *  ukm [1] EXPLICIT UserKeyingMaterial OPTIONAL,
 *  keyEncryptionAlgorithm KeyEncryptionAlgorithmIdentifier,
 *  recipientEncryptedKeys RecipientEncryptedKeys }
 */
 export class KeyAgreeRecipientInfo {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version: CMSVersion = CMSVersion.v3;

  @AsnProp({ type: OriginatorIdentifierOrKey, context: 0 })
  public originator = new OriginatorIdentifierOrKey();

  @AsnProp({ type: OctetString, context: 1, optional: true })
  public ukm?: UserKeyingMaterial = new OctetString();

  @AsnProp({ type: KeyEncryptionAlgorithmIdentifier })
  public keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();

  @AsnProp({ type: RecipientEncryptedKeys })
  public recipientEncryptedKeys = new RecipientEncryptedKeys();

  constructor(params: Partial<KeyAgreeRecipientInfo> = {}) {
    Object.assign(this, params);
  }
}