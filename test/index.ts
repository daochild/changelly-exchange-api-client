import {expect} from 'chai';
import {Changelly} from '../src';

describe('static methods check', () => {
    it('should get KYC message', () => {
        expect(
            Changelly.agreeWithKycMessage(),
            'Exchange services provided by Changelly. By clicking “Accept”, I acknowledge and understand that my transaction may trigger AML/KYC verification according to Changelly AML/KYC”'
        );
    });
})
