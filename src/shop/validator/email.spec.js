import { strictEqual } from 'node:assert';
import { sanitize_email, is_valid_email } from './email.js';

describe('shop/validator/email', () => {
    describe('sanitize_email', () => {
        it('undefined', async () => {
            strictEqual(sanitize_email(), '');
        });
        it('email', async () => {
            strictEqual(sanitize_email('user@domain.com'), 'user@domain.com');
        });
        it('trim email', async () => {
            strictEqual(sanitize_email(' user@domain.com '), 'user@domain.com');
        });
        it('gmail test email', async () => {
            strictEqual(sanitize_email('john.doe+test@gmail.com'), 'john.doe+test@gmail.com');
        });
        it('remove brakets', async () => {
            strictEqual(sanitize_email('<a href="#">john.doe+test@gmail.com</a>'), 'ahrefjohn.doe+test@gmail.coma');
        });
        it('wrong quotation', async () => {
            strictEqual(sanitize_email('a"b(c)d,e:f;g<h>i[j\k]l@example.com'), 'abcdefghijkl@example.com');
        });

    });
    describe('is_valid_email', () => {
        it('required fields but invalid', async () => {
            strictEqual(is_valid_email('@.'), false);
        });
        it('missing target before @', async () => {
            strictEqual(is_valid_email('@a.a'), false);
        });
        it('minimal email', async () => {
            strictEqual(is_valid_email('a@a.a'), true);
        });
        it('gmail test email', async () => {
            strictEqual(is_valid_email('john.doe+test@gmail.com'), true);
        });
        it('missing TLD', async () => {
            strictEqual(is_valid_email('admin@example'), false);
        });
        it('missing @', async () => {
            strictEqual(is_valid_email('abc.example.com'), false);
        });
        it('multiple @', async () => {
            strictEqual(is_valid_email('a@b@c@example.com'), false);
        });
        it('wrong quotation', async () => {
            strictEqual(is_valid_email('a"b(c)d,e:f;g<h>i[j\\k]l@example.com'), false);
        });
    });
});
