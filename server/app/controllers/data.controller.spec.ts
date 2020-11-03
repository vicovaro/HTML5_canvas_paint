import { Application } from '@app/app';
import { DatabasePicureService } from '@app/services/database-picture.service';
import { TYPES } from '@app/types';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_BAD_REQUEST_OK = 400;
describe('Data Controller', () => {
    // const baseMessageErreur = { title: 'Error', body: '' } as Message;

    let dataService: Stubbed<DatabasePicureService>;
    let app: Express.Application;
    let isDate: Date = new Date('10/08/2020');
    const testCanvasInformationAdd = {
        _id: '',
        name: 'stest5',
        labels: [{ label: 'label1' }],
        width: 0,
        height: 0,
        date: isDate,
        picture: 'test5',
    } as CanvasInformation;
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabasePicureService).toConstantValue({
            getPicturesLabals: sandbox.stub().resolves(testCanvasInformationAdd),
            getPictures: sandbox.stub().resolves(testCanvasInformationAdd),
            getAllLabel: sandbox.stub().resolves(testCanvasInformationAdd),
            getPicturesName: sandbox.stub().resolves(testCanvasInformationAdd),
            getPicturesDate: sandbox.stub().resolves(testCanvasInformationAdd),
            addPicture: sandbox.stub().resolves(undefined),
            modifyPicture: sandbox.stub().resolves(undefined),
            delete: sandbox.stub().resolves(true),
        });
        dataService = container.get(TYPES.DatabasePicureService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return ', async () => {
        dataService.getPictures.resolves(testCanvasInformationAdd);
        return supertest(app)
            .get('/api/data')
            .expect(HTTP_STATUS_OK)
            .then((reponse: any) => {
                expect(reponse.body.name).to.deep.equal(testCanvasInformationAdd.name);
            });
    });
    it('should return rejet ', async () => {
        dataService.getPictures.rejects(new Error('error in the service'));
        return supertest(app)
            .get('/api/data')
            .expect(HTTP_STATUS_OK)
            .then((reponse: any) => {
                expect(reponse.body._id).to.deep.equal('Error');
            });
    });
    it('should post test labels', async () => {
        dataService.getPicturesLabals;
        const service: Message = {
            title: 'labels',
            body: 'label1',
        };

        return supertest(app)
            .post('/api/data/labels')
            .send(service)
            .expect(HTTP_STATUS_OK)
            .then(async (reponse: any) => {
                expect(reponse.body.name).to.deep.equal(testCanvasInformationAdd.name);
                expect(reponse.body.labels[0]).to.deep.equal(testCanvasInformationAdd.labels[0]);
                expect(reponse.body._id).to.deep.equal(testCanvasInformationAdd._id);
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('should post test labels body message is int ', async () => {
        dataService.getPicturesLabals.rejects(new Error('error in the service'));
        const service = {
            title: 'labels',
            body: 55555,
        };

        return supertest(app)
            .post('/api/data/labels')
            .send(service)
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .then((reponse: any) => {
                expect(reponse.body._id).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err.message);
            });
    });
    it('should post test labels error mongodb', async () => {
        dataService.getPicturesLabals.rejects(new Error('error in the service'));
        const service = {
            title: 'Titre',
            body: 'lable1',
        };

        return supertest(app)
            .post('/api/data/labels')
            .send(service)
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .then((reponse: any) => {
                console.log(reponse.body);
                expect(reponse.body._id).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err.message);
            });
    });
    it('should post test labels error mongodb', async () => {
        dataService.getPicturesLabals.rejects(new Error('error in the service mongo'));
        const service: Message = {
            title: 'labels',
            body: 'label1',
        };

        return supertest(app)
            .post('/api/data/labels')
            .send(service)
            .expect(HTTP_STATUS_OK)
            .then(async (reponse: any) => {
                expect(reponse.body._id).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('should get test error /all_labels', async () => {
        dataService.getAllLabel.rejects(new Error('error in the service mongo'));
        return supertest(app)
            .get('/api/data/all_labels')
            .send()
            .expect(HTTP_STATUS_OK)
            .then(async (reponse: any) => {
                expect(reponse.body._id).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('should get test /all_label', async () => {
        const Labels: Label[] = [{ label: 'label1' }, { label: 'label2' }];
        dataService.getAllLabel.resolves(Labels);
        return supertest(app)
            .get('/api/data/all_labels')
            .expect(HTTP_STATUS_OK)
            .then(async (reponse: any) => {
                expect(reponse.body.labels[0].label).to.equal(Labels[0].label);
                expect(reponse.body.labels[1].label).to.equal(Labels[1].label);
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in not request', async () => {
        return supertest(app)
            .post('/api/data/research')
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .send()
            .then(async (reponse: any) => {
                expect(reponse.body._id).to.equal('Error');
                expect(reponse.body.name).to.equal('not request in post');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in not good research', async () => {
        const service: Message = {
            title: 'labels',
            body: 'label1',
        };
        return supertest(app)
            .post('/api/data/research')
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .send(service)
            .then(async (reponse: any) => {
                expect(reponse.body._id).to.equal('Error');
                expect(reponse.body.name).to.equal('not good research : ' + service.title);
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in not good research', async () => {
        const service = {
            title: 55555,
            body: 66666,
        };
        return supertest(app)
            .post('/api/data/research')
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .send(service)
            .then(async (reponse: any) => {
                expect(reponse.body._id).to.equal('Error');
                expect(reponse.body.name).to.equal('not good research : ' + service.title);
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in good research name both error', async () => {
        dataService.getPicturesName.rejects(new Error('error in the service mongo'));
        const service = {
            title: 'name',
            body: 66666,
        };
        return supertest(app)
            .post('/api/data/research')
            .expect(HTTP_STATUS_OK)
            .send(service)
            .then(async (reponse: any) => {
                expect(reponse.body._id).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in good research name ', async () => {
        const service = {
            title: 'name',
            body: 'stest5',
        };
        return supertest(app)
            .post('/api/data/research')
            .expect(HTTP_STATUS_OK)
            .send(service)
            .then(async (reponse: any) => {
                expect(reponse.body._id).to.equal(testCanvasInformationAdd._id);
                expect(reponse.body.name).to.equal(service.body);
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in good research date ', async () => {
        const service = {
            title: 'date',
            body: isDate.toString(),
        };
        return supertest(app)
            .post('/api/data/research')
            .expect(HTTP_STATUS_OK)
            .send(service)
            .then(async (reponse: any) => {
                expect(reponse.body._id).to.equal(testCanvasInformationAdd._id);
                expect(reponse.body.date).to.equal('2020-10-08T04:00:00.000Z');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in good research date both error', async () => {
        dataService.getPicturesDate.rejects(new Error('error in the service mongo'));
        const service = {
            title: 'date',
            body: 66666,
        };
        return supertest(app)
            .post('/api/data/research')
            .expect(HTTP_STATUS_OK)
            .send(service)
            .then(async (reponse: any) => {
                expect(reponse.body._id).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in good savePicture update', async () => {
        const newCanvasInformationAdd = {
            _id: '1234',
            name: 'stest5',
            labels: [{ label: 'label1' }],
            width: 0,
            height: 0,
            date: isDate,
            picture: 'test5',
        } as CanvasInformation;
        return supertest(app)
            .post('/api/data/savePicture')
            .expect(HTTP_STATUS_OK)
            .send(newCanvasInformationAdd)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('success');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in good savePicture save', async () => {
        const newCanvasInformationAdd = {
            _id: '',
            name: 'stest5',
            labels: [{ label: 'label1' }],
            width: 0,
            height: 0,
            date: isDate,
            picture: 'test5',
        } as CanvasInformation;
        return supertest(app)
            .post('/api/data/savePicture')
            .expect(HTTP_STATUS_OK)
            .send(newCanvasInformationAdd)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('success');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in not good savePicture update', async () => {
        dataService.modifyPicture.rejects(new Error('error in the service mongo'));
        const newCanvasInformationAdd = {
            _id: '1234',
            name: 'stest5',
            labels: [{ label: 'label1' }],
            width: 0,
            height: 0,
            date: isDate,
            picture: 'test5',
        } as CanvasInformation;
        return supertest(app)
            .post('/api/data/savePicture')
            .expect(HTTP_STATUS_OK)
            .send(newCanvasInformationAdd)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in not good savePicture save', async () => {
        dataService.addPicture.rejects(new Error('error in the service mongo'));
        const newCanvasInformationAdd = {
            _id: '',
            name: 'sstest5',
            labels: [{ label: 'label1' }],
            width: 0,
            height: 0,
            date: isDate,
            picture: 'test5',
        } as CanvasInformation;
        return supertest(app)
            .post('/api/data/savePicture')
            .expect(HTTP_STATUS_OK)
            .send(newCanvasInformationAdd)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in not good savePicture ', async () => {
        return supertest(app)
            .post('/api/data/savePicture')
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in not good savePicture label and name error', () => {
        const newCanvasInformationAdd = {
            _id: '',
            name: 'test5 ',
            labels: [{ label: 'label1' }, { label: 'label$' }],
            width: 0,
            height: 0,
            date: isDate,
            picture: 'test5',
        } as CanvasInformation;
        return supertest(app)
            .post('/api/data/savePicture')
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .send(newCanvasInformationAdd)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('post in not good savePicture label < 6', () => {
        const newCanvasInformationAdd = {
            _id: '',
            name: 'test5 ',
            labels: [{ label: 'label1' }, { label: 'label' }],
            width: 0,
            height: 0,
            date: isDate,
            picture: 'test5',
        } as CanvasInformation;
        return supertest(app)
            .post('/api/data/savePicture')
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .send(newCanvasInformationAdd)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Error');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('delite not request message', () => {
        //dataService.getPicturesLabals.rejects(new Error('error in the service'));
        return supertest(app)
            .post('/api/data/delete')
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .send()
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Error');
                expect(reponse.body.body).to.equal('not request message');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('delite', () => {
        //dataService.getPicturesLabals.rejects(new Error('error in the service'));
        const message: Message = { title: '', body: '' };
        return supertest(app)
            .post('/api/data/delete')
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .send(message)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Error');
                expect(reponse.body.body).to.equal('It not delete title element');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('delite', () => {
        dataService.delete.rejects(new Error('error in the service'));
        const message: Message = { title: 'delete', body: 'ssss' };
        return supertest(app)
            .post('/api/data/delete')
            .expect(HTTP_STATUS_BAD_REQUEST_OK)
            .send(message)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Error');
                expect(reponse.body.body).to.equal('error in the service');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('delite success', () => {
        const message: Message = { title: 'delete', body: 'ssss' };
        return supertest(app)
            .post('/api/data/delete')
            .expect(HTTP_STATUS_OK)
            .send(message)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Success');
                expect(reponse.body.body).to.equal('Success');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
    it('delite success', () => {
        dataService.delete.resolves(false);
        const message: Message = { title: 'delete', body: 'ssss' };
        return supertest(app)
            .post('/api/data/delete')
            .expect(HTTP_STATUS_OK)
            .send(message)
            .then(async (reponse: any) => {
                expect(reponse.body.title).to.equal('Not delete');
                expect(reponse.body.body).to.equal('not good id');
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });
});
