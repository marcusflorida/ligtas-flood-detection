package com.example.thesis_backend.controller;

import com.example.thesis_backend.model.Contact;
import com.example.thesis_backend.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    // GET all contacts
    @GetMapping
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    // POST - create new contact
    @PostMapping
    public Contact createContact(@RequestBody Contact contact) {
        return contactRepository.save(contact);
    }

    // PUT - update existing contact
    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable Long id, @RequestBody Contact updated) {
        return contactRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setPhoneNumber(updated.getPhoneNumber());
                    existing.setOrganization(updated.getOrganization());
                    return ResponseEntity.ok(contactRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - remove contact
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}