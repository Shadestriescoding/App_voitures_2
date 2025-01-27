import fs from 'fs';
import path from 'path';
import { Car, CarCreateInput, CarUpdateInput } from '@/types';

const CARS_FILE_PATH = path.join(process.cwd(), 'cars.json');

function readCarsFile(): Car[] {
  try {
    const fileContent = fs.readFileSync(CARS_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

function writeCarsFile(cars: Car[]): void {
  fs.writeFileSync(CARS_FILE_PATH, JSON.stringify(cars, null, 2), 'utf-8');
}

export function getAllCars(): Car[] {
  return readCarsFile();
}

export function getCarById(id: string): Car | null {
  const cars = readCarsFile();
  return cars.find(car => car.id === id) || null;
}

export function createCar(carData: CarCreateInput): Car {
  const cars = readCarsFile();
  const now = new Date().toISOString();
  
  const newCar: Car = {
    ...carData,
    id: `car_${Date.now()}`,
    createdAt: now,
    updatedAt: now
  };

  cars.push(newCar);
  writeCarsFile(cars);
  return newCar;
}

export function updateCar(id: string, updates: CarUpdateInput): Car | null {
  const cars = readCarsFile();
  const carIndex = cars.findIndex(car => car.id === id);
  
  if (carIndex === -1) {
    return null;
  }

  const updatedCar: Car = {
    ...cars[carIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  cars[carIndex] = updatedCar;
  writeCarsFile(cars);
  return updatedCar;
}

export function deleteCar(id: string): boolean {
  const cars = readCarsFile();
  const filteredCars = cars.filter(car => car.id !== id);
  
  if (filteredCars.length === cars.length) {
    return false;
  }

  writeCarsFile(filteredCars);
  return true;
} 