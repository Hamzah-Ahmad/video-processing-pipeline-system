import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentAndUserTable1780289931150 implements MigrationInterface {
    name = 'UpdateCommentAndUserTable1780289931150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_user_projection" RENAME COLUMN "id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" RENAME CONSTRAINT "PK_e46e66ed2b65c4fa54f599135a8" TO "PK_179ed2c038a55f282d1925243a7"`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" DROP CONSTRAINT "PK_179ed2c038a55f282d1925243a7"`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" ADD CONSTRAINT "PK_179ed2c038a55f282d1925243a7" PRIMARY KEY ("userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_user_projection" DROP CONSTRAINT "PK_179ed2c038a55f282d1925243a7"`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" ADD "userId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" ADD CONSTRAINT "PK_179ed2c038a55f282d1925243a7" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" RENAME CONSTRAINT "PK_179ed2c038a55f282d1925243a7" TO "PK_e46e66ed2b65c4fa54f599135a8"`);
        await queryRunner.query(`ALTER TABLE "comment_user_projection" RENAME COLUMN "userId" TO "id"`);
    }

}
