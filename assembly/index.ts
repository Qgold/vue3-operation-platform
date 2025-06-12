// The entry file of your WebAssembly module.

// 定义货物类
export class Cargo {
  id: i32;
  x: f32;
  y: f32;
  z: f32;
  width: f32;
  height: f32;
  depth: f32;
  weight: f32;

  constructor(id: i32, x: f32, y: f32, z: f32, width: f32, height: f32, depth: f32, weight: f32) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.weight = weight;
  }
}

// 定义货架类
export class Shelf {
  x: f32;
  y: f32;
  z: f32;
  width: f32;
  height: f32;
  depth: f32;
  maxWeight: f32;
  cargos: Array<Cargo>;

  constructor(x: f32, y: f32, z: f32, width: f32, height: f32, depth: f32, maxWeight: f32) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.maxWeight = maxWeight;
    this.cargos = new Array<Cargo>(0);
  }

  // 检查是否可以放置货物
  canPlaceCargo(cargo: Cargo): bool {
    // 检查重量限制
    let currentWeight: f32 = 0;
    for (let i = 0; i < this.cargos.length; i++) {
      currentWeight += this.cargos[i].weight;
    }
    if (currentWeight + cargo.weight > this.maxWeight) {
      return false;
    }

    // 检查空间冲突
    for (let i = 0; i < this.cargos.length; i++) {
      if (this.checkCollision(cargo, this.cargos[i])) {
        return false;
      }
    }

    // 检查是否在货架范围内
    return this.isCargoInShelf(cargo);
  }

  // 添加货物
  addCargo(cargo: Cargo): bool {
    if (this.canPlaceCargo(cargo)) {
      this.cargos.push(cargo);
      return true;
    }
    return false;
  }

  // 移除货物
  removeCargo(cargoId: i32): bool {
    for (let i = 0; i < this.cargos.length; i++) {
      if (this.cargos[i].id == cargoId) {
        this.cargos.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  // 检查货物是否在货架范围内
  private isCargoInShelf(cargo: Cargo): bool {
    return cargo.x >= this.x && cargo.x + cargo.width <= this.x + this.width &&
           cargo.y >= this.y && cargo.y + cargo.height <= this.y + this.height &&
           cargo.z >= this.z && cargo.z + cargo.depth <= this.z + this.depth;
  }

  // 检查两个货物是否碰撞
  private checkCollision(cargo1: Cargo, cargo2: Cargo): bool {
    return !(cargo1.x + cargo1.width <= cargo2.x ||
             cargo1.x >= cargo2.x + cargo2.width ||
             cargo1.y + cargo1.height <= cargo2.y ||
             cargo1.y >= cargo2.y + cargo2.height ||
             cargo1.z + cargo1.depth <= cargo2.z ||
             cargo1.z >= cargo2.z + cargo2.depth);
  }
}

// 定义仓库类
export class Warehouse {
  width: f32;
  height: f32;
  depth: f32;
  shelves: Array<Shelf>;

  constructor(width: f32, height: f32, depth: f32) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.shelves = new Array<Shelf>(0);
  }

  addShelf(x: f32, y: f32, z: f32, width: f32, height: f32, depth: f32, maxWeight: f32): void {
    this.shelves.push(new Shelf(x, y, z, width, height, depth, maxWeight));
  }

  findCargoShelf(cargoId: i32): i32 {
    for (let i = 0; i < this.shelves.length; i++) {
      for (let j = 0; j < this.shelves[i].cargos.length; j++) {
        if (this.shelves[i].cargos[j].id == cargoId) {
          return i;
        }
      }
    }
    return -1;
  }
}

// 创建全局仓库实例
let warehouseInstance: Warehouse = new Warehouse(100, 50, 100);

// 导出仓库属性访问函数
export function getWarehouseWidth(): f32 {
  return warehouseInstance.width;
}

export function getWarehouseHeight(): f32 {
  return warehouseInstance.height;
}

export function getWarehouseDepth(): f32 {
  return warehouseInstance.depth;
}

// 导出货架操作函数
export function addShelf(x: f32, y: f32, z: f32, width: f32, height: f32, depth: f32, maxWeight: f32): i32 {
  warehouseInstance.addShelf(x, y, z, width, height, depth, maxWeight);
  return warehouseInstance.shelves.length - 1;
}

export function getShelfCount(): i32 {
  return warehouseInstance.shelves.length;
}

export function getShelfProperty(index: i32, property: string): f32 {
  if (index < 0 || index >= warehouseInstance.shelves.length) {
    return -1;
  }
  const shelf = warehouseInstance.shelves[index];
  if (property == "x") return shelf.x;
  if (property == "y") return shelf.y;
  if (property == "z") return shelf.z;
  if (property == "width") return shelf.width;
  if (property == "height") return shelf.height;
  if (property == "depth") return shelf.depth;
  if (property == "maxWeight") return shelf.maxWeight;
  return -1;
}

// 导出货物操作函数
export function addCargo(shelfIndex: i32, id: i32, x: f32, y: f32, z: f32, width: f32, height: f32, depth: f32, weight: f32): bool {
  if (shelfIndex < 0 || shelfIndex >= warehouseInstance.shelves.length) {
    return false;
  }
  
  const cargo = new Cargo(id, x, y, z, width, height, depth, weight);
  return warehouseInstance.shelves[shelfIndex].addCargo(cargo);
}

export function removeCargo(shelfIndex: i32, cargoId: i32): bool {
  if (shelfIndex < 0 || shelfIndex >= warehouseInstance.shelves.length) {
    return false;
  }
  return warehouseInstance.shelves[shelfIndex].removeCargo(cargoId);
}

export function getCargoCount(shelfIndex: i32): i32 {
  if (shelfIndex < 0 || shelfIndex >= warehouseInstance.shelves.length) {
    return -1;
  }
  return warehouseInstance.shelves[shelfIndex].cargos.length;
}

export function getCargoProperty(shelfIndex: i32, cargoIndex: i32, property: string): f32 {
  if (shelfIndex < 0 || shelfIndex >= warehouseInstance.shelves.length) {
    return -1;
  }
  const shelf = warehouseInstance.shelves[shelfIndex];
  if (cargoIndex < 0 || cargoIndex >= shelf.cargos.length) {
    return -1;
  }
  const cargo = shelf.cargos[cargoIndex];
  if (property == "x") return cargo.x;
  if (property == "y") return cargo.y;
  if (property == "z") return cargo.z;
  if (property == "width") return cargo.width;
  if (property == "height") return cargo.height;
  if (property == "depth") return cargo.depth;
  if (property == "weight") return cargo.weight;
  return -1;
}

export function getCargoId(shelfIndex: i32, cargoIndex: i32): i32 {
  if (shelfIndex < 0 || shelfIndex >= warehouseInstance.shelves.length) {
    return -1;
  }
  const shelf = warehouseInstance.shelves[shelfIndex];
  if (cargoIndex < 0 || cargoIndex >= shelf.cargos.length) {
    return -1;
  }
  return shelf.cargos[cargoIndex].id;
}