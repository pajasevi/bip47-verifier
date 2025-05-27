import {type FormEvent, useState, useCallback} from 'react'
import ecc from '@bitcoinerlab/secp256k1';
import {BIP47Factory} from "@samouraiwallet/bip47";
import * as utils from '@samouraiwallet/bip47/utils';
import {bitcoinMessageFactory} from "@samouraiwallet/bitcoinjs-message";

const networks = utils.networks;

const bip47 = BIP47Factory(ecc);
const bitcoinjsMessage = bitcoinMessageFactory(ecc);

import './App.css'

function App() {
    const [result, setResult] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const data = new FormData(event.currentTarget);

        const pcode = data.get("pcode") as string;
        const message = data.get("message") as string;
        const signature = data.get("signature") as string;

        try {
            const paynym = bip47.fromBase58(pcode);

            const notifAddress = paynym.getNotificationAddress();

            const result = bitcoinjsMessage.verify(message, notifAddress, signature, networks.bitcoin.messagePrefix)

            setResult(result)
        } catch (error) {
            setResult(null);
            setError(String(error));
        }
    }, [])

    return (
        <>
            <h1>BIP47 Message verifier</h1>
            <div className="card">
                <form onSubmit={onSubmit}>
                    <div>
                        <div>
                            <label htmlFor="pcode">
                                Payment code
                            </label>
                        </div>
                        <input type="text" name="pcode" id="pcode"/>
                    </div>

                    <div>
                        <div>
                            <label htmlFor="message">Message</label>
                        </div>
                        <textarea name="message" id="message"/>
                    </div>

                    <div>
                        <div>
                            <label htmlFor="signature">Signature</label>
                        </div>
                        <input type="text" name="signature" id="signature"/>
                    </div>
                    <div>
                        <button type="submit">Verify message</button>
                    </div>
                </form>
            </div>
            <div>
                {result === true && <span className="success">Message verified successfully</span>}
                {result === false && <span className="error">Message verification failed</span>}
                <span className="error">{error}</span>
            </div>
            <p className="read-the-docs">
                #FREESAMOURAI
            </p>
        </>
    )
}

export default App
