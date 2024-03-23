import { HttpStatus, Injectable, Query } from '@nestjs/common';
import { CreateConsumoDto } from './dto/create-consumo.dto';
import { UpdateConsumoDto } from './dto/update-consumo.dto';
import { ResponseApi } from 'src/response-api/responseApi';
import { Consumo } from './entities/consumo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class ConsumoService {
  constructor(
    @InjectRepository(Consumo) private consumoRepository: Repository<Consumo>,
) {}
  async create(createConsumoDto: CreateConsumoDto) {
    const consumo = await this.getconsumo(createConsumoDto);
    
    if(consumo.success == true){
      createConsumoDto.consumo = Number(createConsumoDto.consumo);
      createConsumoDto.mes = Number(createConsumoDto.mes);
      createConsumoDto.year = Number(createConsumoDto.year);
      createConsumoDto.instalacion = Number(createConsumoDto.instalacion);
      createConsumoDto.lectura = Number(createConsumoDto.lectura);
      createConsumoDto.lectura_anterior = Number(createConsumoDto.lectura_anterior);

      //console.log('consumo crar: ', createConsumoDto);
      const newconsumo = await this.consumoRepository.save(this.consumoRepository.create(createConsumoDto));
      const sql=`update public.lecturas_pendientes 
      set procesado= true,lectura= ${createConsumoDto.lectura} where instalacion=${createConsumoDto.instalacion}`;
      //console.log('sqlXXXX: ', sql);
      let result = await this.consumoRepository.query( sql);
      //console.log('consumo crar: ', newconsumo);
      return new ResponseApi(HttpStatus.CREATED, true, 'Consumo registrado correctamente', createConsumoDto);
    }else{
      return consumo;
    }
    
  }

  async updateLecturas( _params) {
      const sql=`update public.lecturas_pendientes 
      set procesado = false,lectura = 0 where instalacion=${_params.instalacion}`;
      //console.log('sqlXXXX: ', sql);
      let result = await this.consumoRepository.query( sql);
      //console.log('consumo crar: ', newconsumo);
      return new ResponseApi(HttpStatus.CREATED, true, 'Lectura Eliminada', _params);

    
  }

  async createLecturasPendientes(_params : any){
    let result = await this.consumoRepository.query( `select count(*) as registros from  public.lecturas_pendientes where not procesado`);
    
    if (result[0].registros > 0 ){
      return new ResponseApi(HttpStatus.CONFLICT, false, 'Faltan lecturas por leer', result);
    }
    result = await this.consumoRepository.query( `truncate public.lecturas_pendientes `);
    const query = `INSERT INTO public.lecturas_pendientes (instalacion, cliente, sector,mes,year,sector_codigo)
    select a.codigo as instalacion , a.nombre  , s.nombre , ${_params.mes} as mes,${_params.year}  as year,s.codigo as sector_codigo
     from instalaciones  a
    join sector s on s.codigo =a.sector_codigo where a.activo `;
    
    result = await this.consumoRepository.query( query);
    console.log('query result: ', result);
    return new ResponseApi(HttpStatus.CREATED, true, 'Inicio proceso lecturas', result);

  }

  async findAll(_params) {
    //const result = await this.consumoRepository.find();
    //return new ResponseApi(HttpStatus.ACCEPTED, true, 'Consulta exitosa de todos los consumos', result);


    let query = `SELECT instalacion, cliente, sector,lectura
    FROM public.lecturas_pendientes  WHERE mes=${_params.mes}  AND year=${_params.year} and procesado =${_params.pendientes} order by instalacion`;

    
    const result = await this.consumoRepository.query( query );
  
    if (result.length == 0){
      return new ResponseApi(HttpStatus.ACCEPTED, false, '', result);
    }else{
      return new ResponseApi(HttpStatus.ACCEPTED, true, 'Data retornada', result); 
    }
    
  }

  async findOnes(mes: number, year: number, instalacion:number) {
    const consumoFound = await this.consumoRepository.findOneBy({ mes: mes, year: year, instalacion: instalacion });

    if (!consumoFound) {
      return new ResponseApi(HttpStatus.NOT_FOUND, false, 'Error consumo no encontrado ', consumoFound);
    };

    return new ResponseApi(HttpStatus.ACCEPTED, true, 'Consumo encontrado ', consumoFound);
  }

  async findOne(id: number) {
    const consumoFound = await this.consumoRepository.findOneBy({ codigo: id });

    if (!consumoFound) {
      return new ResponseApi(HttpStatus.NOT_FOUND, false, 'Advertencia: consumo no encontrado ', consumoFound);
    };

    return new ResponseApi(HttpStatus.ACCEPTED, true, 'Consulta exitosa', consumoFound);
  }

  async update(id: number, updateConsumoDto: UpdateConsumoDto) {
    const consumoFound = await this.consumoRepository.findOneBy({codigo: id});

    if (!consumoFound) {
      return new ResponseApi(HttpStatus.CONFLICT,false,'Advertencia: consumo no existe', updateConsumoDto);
    }

    const updatedUser = Object.assign(consumoFound, updateConsumoDto);
    this.consumoRepository.save(updatedUser);

    return  new ResponseApi(HttpStatus.ACCEPTED,true,'Consumo actualizado correctamente', updatedUser);
  }

  /*async remove(id: number) { 
    const consumoDelete = await this.consumoRepository.findOneBy({: id});
    if(!consumoDelete){
      return new ResponseApi(HttpStatus.NOT_FOUND, false, 'Advertencia: consumo no encontrado', {});
    }
    this.consumoRepository.delete(id);
      return  new ResponseApi(HttpStatus.ACCEPTED,true,'El consumo se eliminó correctamente', consumoDelete);
  }*/


  async getconsumo(_params : any){

    let query = `SELECT count(*)
    FROM public.lecturas_pendientes  WHERE procesado and  mes=${_params.mes}  AND year=${_params.year}  AND instalacion=${_params.instalacion} `;

    console.log('Query XXX:', query);
    const result = await await this.consumoRepository.query(query);
    console.log('result XXX:', result);
    
    /*this.consumoRepository.find({
      where: {
        mes: Number(_params.mes),
        year: Number(_params.year),
        instalacion: Number(_params.instalacion)
      },
      
    });*/
  
    if (result.count== 0){
      return new ResponseApi(HttpStatus.ACCEPTED, true, '', result);
    }else{
      return new ResponseApi(HttpStatus.ACCEPTED, false, 'El consumo para este mes ya fue registrado', result); 
    }
    
  }

  async findinstalacion( _params : any){
    const result = await this.consumoRepository.query( `SELECT codigo,codigo_medidor,nombre,direccion,sector_nombre , 
    public.func_retorna_lectura(${_params.instalacion}) as lectura_anterior
    FROM view_instalaciones WHERE codigo=${_params.instalacion} `);
    
    if (result.length == 0){
      //console.log("data 1", result);
      return new ResponseApi(HttpStatus.ACCEPTED, false, 'Instalacion no existe', result);
    }else{
      return new ResponseApi(HttpStatus.ACCEPTED, true, 'Data retornada', result); 
    } 
  }
}
