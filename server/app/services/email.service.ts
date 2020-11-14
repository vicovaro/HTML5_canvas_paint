import axios from 'axios';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    private readonly x_team_key = '42e98715-06d2-4f68-a853-e3fa5f7f9151';
    private readonly url = 'http://log2990.step.polymtl.ca/email?address_validation\n=true&quick_return=true&dry_run=false';

    // https://regexr.com/3e48o
    private readonly emailRegexValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    constructor() {}

    async isEmailValid(email: string): Promise<boolean> {
        return new Promise(() => {
            if (email.match(this.emailRegexValidation)) return true;
            return false;
        });
    }

    async sendEmail(emailAndBinaryImage: FormData): Promise<boolean> {
        return new Promise(() => {
            axios({
                method: 'post',
                url: this.url,
                headers: {
                    'x-team-key': this.x_team_key,
                },
                data: emailAndBinaryImage,
            })
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    return true;
                })
                .catch((error) => {
                    console.log(error);
                    return false;
                });
        });
    }
}
