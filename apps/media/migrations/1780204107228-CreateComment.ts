import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateComment1780204107228 implements MigrationInterface {
    name = 'CreateComment1780204107228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "text" character varying NOT NULL, "mediaId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0354a9a009d3bb45a08655ce3" ON "comment" ("userId") `);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_aa9464476aac872680345886f56" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_aa9464476aac872680345886f56"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0354a9a009d3bb45a08655ce3"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
