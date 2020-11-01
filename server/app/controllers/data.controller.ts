import { DatabasePicureService } from '@app/services/database-picture.service';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

const HTTP_STATUS_BAD_REQUEST = 400;
const MIN_CHARACTER = 6;
const MAX_CHARACTER = 10;
@injectable()
export class DataController {
    router: Router;

    constructor(@inject(TYPES.DatabasePicureService) private databaseService: DatabasePicureService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getPictures()
                .then((cancasInformation: CancasInformation[]) => {
                    res.json(cancasInformation);
                })
                .catch((reason: unknown) => {
                    const errorMessage: CancasInformation = {
                        _id: 'Error',
                        name: reason as string,
                        labels: [],
                        width: 0,
                        height: 0,
                        date: new Date(),
                        picture: '',
                    };
                    res.json(errorMessage);
                });
        });
        this.router.get('/all_labels', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllLabel()
                .then((labelsInformation: Label[]) => {
                    const informationMessage: CancasInformation = {
                        _id: 'list_of_all_labals',
                        name: 'labels',
                        labels: labelsInformation,
                        width: 0,
                        height: 0,
                        date: new Date(),
                        picture: '',
                    };
                    res.json(informationMessage);
                })
                .catch((reason: unknown) => {
                    const errorMessage: CancasInformation = {
                        _id: 'Error',
                        name: reason as string,
                        labels: [],
                        width: 0,
                        height: 0,
                        date: new Date(),
                        picture: '',
                    };
                    res.json(errorMessage);
                });
        });
        this.router.post('/labels', (req: Request, res: Response, next: NextFunction) => {
            let sbody: string;
            let labels: string[] = [];
            if (req.body.title === 'labels') {
                try {
                    sbody = req.body.body;
                    labels = this.textToTable(sbody);
                } catch (error) {
                    const errorData: CancasInformation = {
                        _id: 'Error',
                        name: error as string,
                        labels: [],
                        width: 0,
                        height: 0,
                        date: new Date(),
                        picture: '',
                    };
                    res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
                    sbody = 'Error';
                }
            } else {
                const errorData: CancasInformation = {
                    _id: 'Error',
                    name: 'Titre message non valide',
                    labels: [],
                    width: 0,
                    height: 0,
                    date: new Date(),
                    picture: '',
                };
                res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
                sbody = 'Error';
            }

            if (sbody !== 'Error') {
                this.databaseService
                    .getPicturesLabals(labels)
                    .then((cancasInformation: CancasInformation[]) => {
                        res.json(cancasInformation);
                    })
                    .catch((reason: unknown) => {
                        const errorMessage: CancasInformation = {
                            _id: 'Error',
                            name: reason as string,
                            labels: [],
                            width: 0,
                            height: 0,
                            date: new Date(),
                            picture: '',
                        };
                        res.json(errorMessage);
                    });
            }
        });
        this.router.post('/research', (req: Request, res: Response, next: NextFunction) => {
            let research: string;

            if (req.body.title !== undefined) {
                research = req.body.body;
                switch (req.body.title) {
                    case 'name':
                        this.databaseService
                            .getPicturesName(research)
                            .then((cancasInformation: CancasInformation[]) => {
                                res.json(cancasInformation);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: CancasInformation = {
                                    _id: 'Error',
                                    name: reason as string,
                                    labels: [],
                                    width: 0,
                                    height: 0,
                                    date: new Date(),
                                    picture: '',
                                };
                                res.json(errorMessage);
                            });
                        break;
                    case 'date':
                        this.databaseService
                            .getPicturesDate(research)
                            .then((cancasInformation: CancasInformation[]) => {
                                res.json(cancasInformation);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: CancasInformation = {
                                    _id: 'Error',
                                    name: reason as string,
                                    labels: [],
                                    width: 0,
                                    height: 0,
                                    date: new Date(),
                                    picture: '',
                                };
                                res.json(errorMessage);
                            });
                        break;
                    default:
                        const errorData: CancasInformation = {
                            _id: 'Error',
                            name: 'not good research : ' + req.body.title,
                            labels: [],
                            width: 0,
                            height: 0,
                            date: new Date(),
                            picture: '',
                        };
                        res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
                        break;
                }
            } else {
                const errorData: CancasInformation = {
                    _id: 'Error',
                    name: 'not request in post',
                    labels: [],
                    width: 0,
                    height: 0,
                    date: new Date(),
                    picture: '',
                };
                res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
            }
        });
        this.router.post('/savePicture', (req: Request, res: Response, next: NextFunction) => {
            if (this.testBodyCancasInformation(req)) {
                const newPicture: CancasInformation = {
                    _id: req.body._id,
                    name: req.body.name,
                    labels: req.body.labels,
                    date: req.body.date,
                    picture: req.body.picture,
                    height: req.body.height,
                    width: req.body.width,
                };
                if (this.checkName(newPicture.name) || this.checkLabel(newPicture.labels)) {
                    const errorMessage: Message = {
                        title: 'Error',
                        body:
                            'name error : ' +
                            this.checkName(newPicture.name) +
                            ' Request : ' +
                            newPicture.name +
                            '; label error : ' +
                            this.checkLabel(newPicture.labels) +
                            ' Request : ' +
                            newPicture.labels,
                    };
                    res.status(HTTP_STATUS_BAD_REQUEST).json(errorMessage);
                } else {
                    if (newPicture._id === '') {
                        this.databaseService
                            .addPicture(newPicture)
                            .then((good: boolean) => {
                                const successMessage: Message = {
                                    title: 'success',
                                    body: 'addPicture : ' + good,
                                };
                                res.json(successMessage);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: Message = {
                                    title: 'Error',
                                    body: reason as string,
                                };
                                res.json(errorMessage);
                            });
                    } else {
                        this.databaseService
                            .modifyPicture(newPicture)
                            .then((good: boolean) => {
                                const successMessage: Message = {
                                    title: 'success',
                                    body: 'modifyPicture : ' + good,
                                };
                                res.json(successMessage);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: Message = {
                                    title: 'Error',
                                    body: reason as string,
                                };
                                res.json(errorMessage);
                            });
                    }
                }
            } else {
                const errorMessage: Message = {
                    title: 'Error',
                    body: 'it is not picture',
                };
                res.status(HTTP_STATUS_BAD_REQUEST).json(errorMessage);
            }
        });
    }
    private textToTable(theTest: string): string[] {
        return theTest.split(',');
    }
    private testBodyCancasInformation(req: Request): boolean {
        return (
            req.body._id !== undefined &&
            req.body.name !== undefined &&
            req.body.date !== undefined &&
            req.body.width !== undefined &&
            req.body.height !== undefined &&
            req.body.picture !== undefined
        );
    }
    private checkName(name: string): boolean {
        return name === '' || name === undefined || this.notGoodCharacter(name) || name.split(' ').length !== 1;
    }
    private checkLabel(labels: Label[]): boolean {
        for (let index = 0; index < labels.length; index++) {
            const label = labels[index];
            if (this.notGoodCharacter(label.label)) {
                return true;
            }
            if (label.label.length < MIN_CHARACTER || label.label.length > MAX_CHARACTER) return true;
        }
        return false;
    }
    private notGoodCharacter(text: string): boolean {
        return (
            text.split('#').length !== 1 ||
            text.split("'").length !== 1 ||
            text.split('/').length !== 1 ||
            text.split('"').length !== 1 ||
            text.split('-').length !== 1 ||
            text.split('&').length !== 1 ||
            text.split('*').length !== 1 ||
            text.split('!').length !== 1 ||
            text.split('$').length !== 1 ||
            text.split('?').length !== 1 ||
            text.split('|').length !== 1 ||
            text.split('%').length !== 1
        );
    }
}
