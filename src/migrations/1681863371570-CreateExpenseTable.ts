import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateExpenseTable1681863371570 implements MigrationInterface {
  private readonly tableName = 'expense';
  private readonly fkColumnName = 'FK_USER';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'numeric',
            precision: 6,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'current_timestamp',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'current_timestamp',
          },
        ],
        foreignKeys: [
          {
            name: this.fkColumnName,
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
