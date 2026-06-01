import { MigrationInterface, QueryRunner } from "typeorm";

export class CreaeCommentUserProjectionTable1780280440639 implements MigrationInterface {
    name = 'CreaeCommentUserProjectionTable1780280440639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_user_projection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "username" character varying NOT NULL, CONSTRAINT "PK_e46e66ed2b65c4fa54f599135a8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "comment_user_projection"`);
    }

}
