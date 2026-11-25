const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTitle, createService } = require('../../src/taskService');
const { memoryRepository } = require('../../src/repositories');
test('rechaza título vacío', () => assert.throws(() => validateTitle('  '), /no vacío/));
test('recorta título y crea tarea', async () => {
  const service = createService(memoryRepository());
  const created = await service.create({ title: '  CI/CD  ' });
  assert.equal(created.title, 'CI/CD');
  assert.equal((await service.list()).length, 1);
});
test('completa tarea y da 404 para la inexistente', async () => {
  const service = createService(memoryRepository());
  const created = await service.create({ title: 'Probar' });
  assert.equal((await service.complete(created.id)).done, true);
  await assert.rejects(() => service.complete(987), /no encontrada/);
});
test('lista tareas', async () => {
  const service = createService(memoryRepository());
  await service.create({ title: 'Tarea 1' });
  await service.create({ title: 'Tarea 2' });
  const list = await service.list();
  assert.equal(list.length, 2);
});
