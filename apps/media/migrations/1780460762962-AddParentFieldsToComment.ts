import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParentFieldsToComment1780460762962 implements MigrationInterface {
    name = 'AddParentFieldsToComment1780460762962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "parentId" uuid`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "updatedDate"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "parentId"`);
    }

}
