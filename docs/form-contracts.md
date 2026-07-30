# Form contracts

Request creation/edit requires authentication, `create_request`/`edit_own_request`, and a REST nonce. Required create fields are `startup_name`, `founder_name`, `email`, `phone`, `sector`, `stage`, `description`, and `pitch_deck`; edit only allows the current owner in `draft` or `needs_revision` and permits retaining its existing deck. Sectors: ecommerce, fintech, platform, supply_chain, ai, other. Stages: seed, early, growth, scale. A valid customer save always enters `submitted`.

Role changes accept only a target user and either `admin` or `customer`; target protections are applied server-side. Login accepts username/email + password. Registration accepts email + matching 8-character password and always creates a customer. Reset uses WordPress lost-password/key semantics.
