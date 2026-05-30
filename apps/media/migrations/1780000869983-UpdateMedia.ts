import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMedia1780000869983 implements MigrationInterface {
    name = 'UpdateMedia1780000869983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "originalUrl"`);
        await queryRunner.query(`ALTER TABLE "media" ADD "originalBucket" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media" ADD "originalKey" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "originalKey"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "originalBucket"`);
        await queryRunner.query(`ALTER TABLE "media" ADD "originalUrl" character varying NOT NULL`);
    }

}
