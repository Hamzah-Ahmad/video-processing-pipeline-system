import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMedia1779905032566 implements MigrationInterface {
    name = 'CreateMedia1779905032566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."media_status_enum" AS ENUM('PROCESSING', 'READY', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "title" character varying NOT NULL DEFAULT 'Untitled', "description" character varying, "originalUrl" character varying NOT NULL, "renditions" jsonb, "status" "public"."media_status_enum" NOT NULL DEFAULT 'PROCESSING', "thumbnailUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0db866835bf356d896e1892635" ON "media" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0db866835bf356d896e1892635"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TYPE "public"."media_status_enum"`);
    }

}
