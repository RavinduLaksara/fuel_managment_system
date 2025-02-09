package com.example.fuel_managment_system.security;

import com.example.fuel_managment_system.entity.Admin;
import com.example.fuel_managment_system.entity.Employee;
import com.example.fuel_managment_system.entity.FuelStation;
import com.example.fuel_managment_system.entity.Vehicle;
import com.example.fuel_managment_system.repository.AdminRepository;
import com.example.fuel_managment_system.repository.EmployeeRepository;
import com.example.fuel_managment_system.repository.FuelStationRepository;
import com.example.fuel_managment_system.repository.VehicleRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    private String getJwtFromRequest(HttpServletRequest request) {
        System.out.println("retrived");

        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private FuelStationRepository fuelStationRepository;
    @Autowired
    private AdminRepository adminRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("Request URI: " + request.getRequestURI());

        String jwt = getJwtFromRequest(request);

        if (jwt != null && tokenProvider.validateToken(jwt)) {
            System.out.println("JWT is valid");

            String indentifier = tokenProvider.getIdentifier(jwt);
            System.out.println("Username from JWT: " + indentifier);
            //validation if user is in the employee repository
            Employee employee = employeeRepository.findByUsername(indentifier);
            if (employee != null) {
                UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                        employee.getUsername(), employee.getPassword(), new ArrayList<>());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Logging the validated user
                System.out.println("User validated successfully: " + indentifier);
            }

            //validation if vehicle is in the vehicle repository
            Vehicle vehicle = vehicleRepository.findByRegistrationNumber(indentifier);
            if (vehicle != null) {
                UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                        vehicle.getRegistrationNumber(), vehicle.getEngineNumber(), new ArrayList<>());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Logging the validated user
                System.out.println("Vehicle validated successfully: " + indentifier);
            }

            //validation if user is in the station repository
             FuelStation fuelStation = fuelStationRepository.findByName(indentifier);
                if (fuelStation != null) {
                    UserDetails userDetails = new org.springframework.security.core.userdetails.User( fuelStation.getName(), fuelStation.getPassword(), new ArrayList<>());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // Logging the validated user
                    System.out.println("User validated successfully: " + indentifier);
                }

            //validation if user is in the admin repository
            Admin admin = adminRepository.findByUsername(indentifier);
            if (admin != null) {
                UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                        admin.getUsername(), admin.getPassword(), new ArrayList<>());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Logging the validated user
                System.out.println("Admin validated successfully: " + indentifier);
            }


        } else {
            System.out.println("JWT is invalid or not present");
        }

        filterChain.doFilter(request, response);
    }

}
