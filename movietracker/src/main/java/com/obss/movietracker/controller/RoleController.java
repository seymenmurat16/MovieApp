package com.obss.movietracker.controller;

import com.obss.movietracker.entity.Role;
import com.obss.movietracker.model.ApiResponse;
import com.obss.movietracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final UserService userService;

    @Autowired
    public RoleController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping()
    public ResponseEntity<Role> addRole(@RequestBody Role role){
        ApiResponse apiResponse = userService.addRole(role);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.CREATED);
        }else{
            return new ResponseEntity(apiResponse, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody Role role){
        role.setId(id);
        ApiResponse apiResponse = userService.updateRole(role);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Role> deleteRole(@PathVariable Long id){
        ApiResponse apiResponse = userService.deleteRoleById(id);
        if(apiResponse.getSuccess()){
            return new ResponseEntity(apiResponse, HttpStatus.OK);
        }else{
            return new ResponseEntity(apiResponse,HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<Role> getRoles(){
        return new ResponseEntity(userService.getRoles(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRole(@PathVariable Long id){
        if(userService.getRoleById(id)!= null){
            return new ResponseEntity(userService.getRoleById(id), HttpStatus.OK);
        }else{
            return new ResponseEntity("Bu id numarasına sahip role bulunamadı.",HttpStatus.BAD_REQUEST);
        }
    }

}
